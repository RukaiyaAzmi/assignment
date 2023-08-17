import { toSnakeCase } from 'keys-transform'

export function toDisplayString(key: string) {
  return toSnakeCase(key).replace(/_/, ' ').toUpperCase()
}
