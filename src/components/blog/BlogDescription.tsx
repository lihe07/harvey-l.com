import { Show } from "solid-js";

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.436875); // Average days in a month
  const years = Math.floor(days / 365.25); // Average days in a year

  if (days < 1) {
    return "Today";
  } else if (days < 7) {
    return `${days} days ago`;
  } else if (weeks < 4) {
    return `${weeks} weeks ago`;
  } else if (months < 12) {
    return months === 1 ? "Last month" : `${months} months ago`;
  } else {
    return years === 1 ? "Last year" : `${years} years ago`;
  }
}

export function BlogDescription(props: { date?: string, location: string }) {
  const date = () => props.date ? new Date(props.date) : undefined;
  const relativeTime = () => date() ? formatRelativeTime(date()!) : "";

  return (
    <>
      <Show when={date()} fallback={<>
        In {props.location}.
      </>}>
        {relativeTime()}
        <Show when={props.location}> in {props.location}.</Show>
      </Show>
    </>
  );
}
