export const ACTION_TYPE_SEPARATOR: string = '||'

export default function combineActions(...actionTypes: string[]) {
  return actionTypes.join(ACTION_TYPE_SEPARATOR)
}

export function matchActionType(combinedType: string, actionType: string): boolean {
  return combinedType.split(ACTION_TYPE_SEPARATOR).some(type => type === actionType)
}
