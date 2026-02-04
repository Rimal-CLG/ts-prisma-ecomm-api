export interface FilterArgs {
  filter?: string;
}
export interface FilterRTN {
  filter?: string | undefined;
}
export function filter(data: FilterArgs): FilterRTN {
  let filter: string | undefined = undefined;
  if (
    typeof data.filter === "string" &&
    data.filter !== "undefined" &&
    data.filter.trim().length > 0
  ) {
    filter = data.filter.trim();
  }
  return { filter };
}
