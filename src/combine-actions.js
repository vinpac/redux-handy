export const ACTION_TYPE_SEPARATOR = '||'
export default function combineActions(...actionTypes) {
  return actionTypes.join(ACTION_TYPE_SEPARATOR)
}

export function matchActionType(combinedType, actionType) {
  return combinedType.split(ACTION_TYPE_SEPARATOR).some(type => type === actionType)
}
