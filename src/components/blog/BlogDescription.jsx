const abbr = ["st", "nd", "rd", "th"];
export const months = [
  "Janurary",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Auguest",
  "September",
  "October",
  "November",
  "December",
];

export function BlogDescription(props) {
  const date = props.date ? new Date(props.date) : undefined;
  return (
    <>
      <Show when={date}>
        {months[date.getMonth()]} {date.getDate()}
        {abbr[Math.min(date.getDate() - 1, 3)]}, {date.getFullYear()}.
      </Show>
      <Show when={props.location}> At {props.location}.</Show>
    </>
  );
}
