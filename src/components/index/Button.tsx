import { JSX } from "solid-js";

export default (props: { class?: string, onClick?: CallableFunction, children: JSX.Element }) => {
  return (
    <button
      onClick={(e) => props.onClick && props.onClick(e)}
      class={
        "bg-white color-white bg-op-10 sm:px-4 sm:py-3 rounded-xl cursor-pointer " +
        "op-80 hover:op-100 active:scale-95 transition flex items-center sm:text-md " +
        "px-3 py-3 text-sm " +
        props.class
      }
    >
      {props.children}
    </button>
  );
};
