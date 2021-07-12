/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AllCardinalPositionConfigs,
  AxisAligns,
  CardinalPositionConfig,
  CardinalPositions,
  PositionConfig,
  PositionObjOrNot,
  Positions,
  WindowDims,
} from '../interfaces.js';
import {
  capitalizeFirstLetter,
  getEnumValueFromStringKey,
  getWindowDimensions,
  removePrefix,
  sumAndSubtract,
  transformSpacedStringToArray,
} from '@cds/core/internal';

type PositioningPreferencesTuple = [number[], number];

export function getOrientationTuple(orientationPrefs: string): PositioningPreferencesTuple {
  let preferredPositions: number[] = [];
  let deniedPositions: number[] = [];

  for (const userPref of transformSpacedStringToArray(orientationPrefs)) {
    if (userPref === 'none') {
      return [[], 0];
    } else if (userPref.indexOf('only:') > -1) {
      return [
        [getEnumValueFromStringKey(Positions, removePrefix(userPref, 'only:'), capitalizeFirstLetter) as number],
        0,
      ];
    } else if (userPref.indexOf('not:') > -1) {
      deniedPositions.push(
        getEnumValueFromStringKey(Positions, removePrefix(userPref, 'not:'), capitalizeFirstLetter) as number
      );
    } else {
      const positionVal = getEnumValueFromStringKey(Positions, userPref, capitalizeFirstLetter) as number;
      deniedPositions.push(positionVal);
      preferredPositions.push(positionVal);
    }
  }

  return [preferredPositions, sumAndSubtract(0, [Positions.All], deniedPositions)];
}

// TODO: start/mid/end need to be consts?
export function getCrossAxisOrderOfPreference(preference: string): number[] {
  switch (preference) {
    case 'mid':
      return [1, 0, 2];
    case 'end':
      return [2, 1, 0];
    case 'start':
    default:
      return [0, 1, 2];
  }
}

export function checkNextPosition(
  whichPosition: number,
  positions: PositionConfig,
  anchorAlignPref: string
): PositionObjOrNot {
  if (positions === false) {
    return false;
  }

  const positionToCheck = (positions as AllCardinalPositionConfigs)[
    Positions[whichPosition]?.toLowerCase()
  ] as CardinalPositionConfig;

  if (!positionToCheck) {
    return false;
  }

  const [startOfAnchor, middleOfAnchor, endOfAnchor] = positionToCheck;

  if (startOfAnchor === false && middleOfAnchor === false && endOfAnchor === false) {
    return false;
  }

  for (const i of getCrossAxisOrderOfPreference(anchorAlignPref)) {
    if (positionToCheck[i]) {
      return Object.assign({}, positionToCheck[i]);
    }
  }

  return false;
}

export function getNextDefaultPosition(currentPositionTotal: number): number[] {
  // TODO: should this live somewhere else?
  const defaults = [Positions.Bottom, Positions.Right, Positions.Left, Positions.Top, Positions.Responsive];

  for (const position of defaults) {
    if (currentPositionTotal >= position) {
      return [position, currentPositionTotal - position];
    }
  }

  return [0, 0];
}

export function getNextPosition(userPrefs: number[], prefTotal: number): [number, number[], number] {
  if (userPrefs.length < 1) {
    let [positionIndexToCheck, newPrefTotal] = getNextDefaultPosition(prefTotal);
    return [positionIndexToCheck, userPrefs, newPrefTotal];
  }

  return [userPrefs[0], userPrefs.slice(1), userPrefs[0] !== Positions.Responsive ? prefTotal : 0];
}

// TODO: TESTME
export function getPointerPosition(workingPositionRelativeToAnchor: string): string {
  switch (workingPositionRelativeToAnchor.toLowerCase()) {
    case 'top':
      return 'popup-bottom';
    case 'bottom':
      return 'popup-top';
    case 'left':
      return 'popup-right';
    case 'right':
    default:
      return 'popup-left';
  }
}

// TODO: TESTME
export function getPointerAlignment(popupPosition: string, pointerAlign: string) {
  let myAligns: any;

  if (popupPosition === 'popup-bottom' || popupPosition === 'popup-top') {
    myAligns = { start: 'pointer-left', mid: 'pointer-center', end: 'pointer-right' };
  } else {
    myAligns = { start: 'pointer-top', mid: 'pointer-mid', end: 'pointer-bottom' };
  }

  return myAligns[pointerAlign];
}

// TODO: TESTME MOHR TESTS!
export function getBestPositionForPreferences(
  positions: PositionConfig,
  preferences: PositioningPreferencesTuple,
  anchorAlignPref: string
): PositionObjOrNot {
  let [arrayOfUserPrefs, currentPrefTotal] = preferences;
  let returnPref: PositionObjOrNot | null = null;

  while (returnPref === null) {
    const [positionToCheck, newArrayOfUserPrefs, newCurrentPrefTotal] = getNextPosition(
      arrayOfUserPrefs,
      currentPrefTotal
    );
    const positionWillWork = checkNextPosition(positionToCheck, positions, anchorAlignPref);

    switch (true) {
      case positionWillWork !== false:
        returnPref = Object.assign({}, positionWillWork, {
          pointerLocation: getPointerPosition(Positions[positionToCheck]),
        });
        break;
      case positionWillWork === false && newCurrentPrefTotal === 0:
        // tested all positions; none of them work
        returnPref = false;
        break;
      case positionWillWork === false:
        // this position won't work but there are more positions to check!
        arrayOfUserPrefs = newArrayOfUserPrefs;
        currentPrefTotal = newCurrentPrefTotal;
        break;
    }
  }

  return returnPref as PositionObjOrNot;
}

// FIXME: WE NO LONGER NEED TO POSITION THE POINTER!
export function getPopupPosition(
  orientationPrefs: string,
  anchorRect: DOMRect,
  anchorAlign: AxisAligns,
  pointer: HTMLElement,
  pointerAlign: AxisAligns,
  popup: HTMLElement,
  mainAxisOffset: number,
  crossAxisOffset: number
): PositionObjOrNot {
  if (!anchorRect) {
    return false; // anchor does not exist; force responsive
  }

  // we have to use offsetHeight/Width here because the DOMRect shifts dimensions when the pointer is rotated
  // the caveat with using offsetHeight/Width is that the values are rounded to an integer
  // that does not seem to be a big risk, however, because these pointers are created by users.
  // if there is a rounding issue, it's likely because a rem sizing has something set to a fractional value
  // and any rounding error would likely be negligible in effect
  // FIXME: IS THIS STILL THE CASE? PROBABLY... BUT IT WOULDN'T HURT TO CHECK
  const pointerDims = pointer ? { height: pointer.offsetHeight, width: pointer.offsetWidth } : { height: 0, width: 0 };
  const windowDims = getWindowDimensions();

  // TODO: TESTME
  if (windowDims.width <= 576) {
    return false;
  }

  const positions = getPositions(
    anchorRect,
    pointerDims,
    pointerAlign,
    popup.getBoundingClientRect(),
    windowDims,
    mainAxisOffset,
    crossAxisOffset
  );

  const myPosition = getBestPositionForPreferences(positions, getOrientationTuple(orientationPrefs), anchorAlign);

  if (myPosition === false) {
    return false;
  }

  const pointerLoc = {
    pointerLocation:
      myPosition.pointerLocation + ' ' + getPointerAlignment(myPosition.pointerLocation as string, pointerAlign),
  };
  return Object.assign({}, myPosition, pointerLoc);
}

export function getPositions(
  anchorRect: DOMRect,
  pointerDims: { height: number; width: number },
  pointerAlign: AxisAligns,
  popupRect: DOMRect,
  windowDims: WindowDims,
  mainAxisOffset: number,
  crossAxisOffset: number
): AllCardinalPositionConfigs {
  return {
    top: getPositionConfig(
      'top',
      pointerAlign,
      anchorRect,
      popupRect,
      pointerDims,
      windowDims,
      mainAxisOffset,
      crossAxisOffset
    ),
    right: getPositionConfig(
      'right',
      pointerAlign,
      anchorRect,
      popupRect,
      pointerDims,
      windowDims,
      mainAxisOffset,
      crossAxisOffset
    ),
    bottom: getPositionConfig(
      'bottom',
      pointerAlign,
      anchorRect,
      popupRect,
      pointerDims,
      windowDims,
      mainAxisOffset,
      crossAxisOffset
    ),
    left: getPositionConfig(
      'left',
      pointerAlign,
      anchorRect,
      popupRect,
      pointerDims,
      windowDims,
      mainAxisOffset,
      crossAxisOffset
    ),
  };
}

export function getPositionConfig(
  cardinalPos: CardinalPositions,
  pointerAlign: AxisAligns,
  anchor: DOMRect,
  popup: DOMRect,
  pointer: { height: number; width: number },
  win: WindowDims,
  mainAxisOffset: number,
  crossAxisOffset: number
): false | CardinalPositionConfig {
  let mainAxisPosition: number | false;

  switch (cardinalPos) {
    case 'top':
      mainAxisPosition = getMainAxisPositionOrViolation(anchor.top, pointer.height, popup.height, mainAxisOffset, 0);

      if (mainAxisPosition === false) {
        return false;
      } else {
        return getPositionOrViolationFromCrossAxis(
          anchor.left,
          anchor.width,
          popup.width,
          crossAxisOffset,
          0,
          win.width,
          pointerAlign
        ).map(
          (cross_axis_pos): PositionObjOrNot => {
            if (cross_axis_pos === false) {
              return false;
            } else {
              return {
                popup: {
                  top: mainAxisPosition as number,
                  left: cross_axis_pos,
                },
              };
            }
          }
        );
      }
    case 'bottom':
      mainAxisPosition = getMainAxisPositionOrViolation(
        anchor.bottom,
        0, // pointer doesn't need to be in this calc
        popup.height,
        mainAxisOffset,
        win.height
      );

      if (mainAxisPosition === false) {
        return false;
      } else {
        return getPositionOrViolationFromCrossAxis(
          anchor.left,
          anchor.width,
          popup.width,
          crossAxisOffset,
          0,
          win.width,
          pointerAlign
        ).map(
          (cross_axis_pos): PositionObjOrNot => {
            if (cross_axis_pos === false) {
              return false;
            } else {
              return {
                popup: {
                  top: anchor.bottom,
                  left: cross_axis_pos,
                },
              };
            }
          }
        );
      }
    case 'left':
      mainAxisPosition = getMainAxisPositionOrViolation(anchor.left, pointer.height, popup.width, mainAxisOffset, 0);

      if (mainAxisPosition === false) {
        return false;
      } else {
        return getPositionOrViolationFromCrossAxis(
          anchor.top,
          anchor.height,
          popup.width,
          crossAxisOffset,
          0,
          win.height,
          pointerAlign
        ).map(
          (cross_axis_pos): PositionObjOrNot => {
            if (cross_axis_pos === false) {
              return false;
            } else {
              return {
                popup: {
                  top: cross_axis_pos,
                  left: mainAxisPosition as number,
                },
              };
            }
          }
        );
      }
    case 'right':
      mainAxisPosition = getMainAxisPositionOrViolation(
        anchor.right,
        0, // pointer doesn't need to be in this calc
        popup.height,
        mainAxisOffset,
        win.width
      );

      if (mainAxisPosition === false) {
        return false;
      } else {
        return getPositionOrViolationFromCrossAxis(
          anchor.top,
          anchor.height,
          popup.height,
          crossAxisOffset,
          0,
          win.height,
          pointerAlign
        ).map(
          (cross_axis_pos): PositionObjOrNot => {
            if (cross_axis_pos === false) {
              return false;
            } else {
              return {
                popup: {
                  top: cross_axis_pos,
                  left: mainAxisPosition as number,
                },
              };
            }
          }
        );
      }
  }
}

type PositionOrViolation = false | number;

export function getMainAxisPosition(
  startPos: number,
  pointer: number,
  popup: number,
  offset: number,
  limit: number
): number {
  const positionModifiers = [pointer, popup, offset];
  return limit === 0
    ? sumAndSubtract(startPos, [], positionModifiers)
    : sumAndSubtract(startPos, positionModifiers, []);
}

export function testMainAxisPosition(pos: number, startPos: number, limit: number): PositionOrViolation {
  if (limit === 0) {
    // if limit is zero, see if position is above zero and return it
    return pos > limit && pos;
  } else {
    // if limit is not zero, position is the start + popup dimension;
    // return start position if position is less than the limit
    return pos < limit && startPos;
  }
}

export function getCrossAxisPosition(
  position: AxisAligns,
  startPos: number,
  anchorAlign: number,
  anchorWidth: number,
  offset: number,
  popup = 0
): number {
  switch (position) {
    case 'mid':
      return startPos + anchorAlign * anchorWidth - 0.5 * popup + offset;
    case 'end':
      return startPos + anchorAlign * anchorWidth - offset;
    case 'start':
      return startPos + anchorAlign * anchorWidth + offset;
  }
}

export function testCrossAxisPosition(
  axisAlign: AxisAligns,
  position: number,
  popup: number,
  limit: [number, number]
): PositionOrViolation {
  const [limitMin, limitMax] = limit;

  switch (axisAlign) {
    case 'mid':
      return position > limitMin && position + popup < limitMax ? position : false;
    case 'end':
      const pulledPosition = position - popup;
      return pulledPosition > limitMin ? pulledPosition : false;
    case 'start':
      return position + popup < limitMax ? position : false;
  }
}
export function getPositionOrViolationFromCrossAxis(
  startPos: number,
  anchorLength: number,
  popupLength: number,
  offset: number,
  limitMinimum: number,
  limitMaximum: number,
  pointerPosition: AxisAligns
): PositionOrViolation[] {
  const anchorAlignments = [0, 0.5, 1];

  return anchorAlignments.map((anchorAlignment: number) => {
    return testCrossAxisPosition(
      pointerPosition,
      getCrossAxisPosition(pointerPosition, startPos, anchorAlignment, anchorLength, offset, popupLength),
      popupLength,
      [limitMinimum, limitMaximum]
    );
  });
}

export function getMainAxisPositionOrViolation(
  startPos: number,
  pointerLength: number,
  popupLength: number,
  offset: number,
  limit: number = 0
): false | number {
  return testMainAxisPosition(
    getMainAxisPosition(startPos, pointerLength, popupLength, offset, limit),
    startPos,
    limit
  );
}
