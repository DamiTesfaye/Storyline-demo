export default function joinStrings(...args: (string | undefined | null)[]): string {
  return args.filter(Boolean).join(' ');
}