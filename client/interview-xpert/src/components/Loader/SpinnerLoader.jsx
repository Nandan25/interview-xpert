import React from "react";

function SpinnerLoader() {
  return (
    <>
      <div role="status">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 101"
          fill="none"
          xmnls="http://www.w3.org/2000/svg"
          class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600"
        >
          <path
            fill="currentColor"
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591"
          />
          <path
            fill="currentFill"
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2"
          />
        </svg>
        <span className="sr-only">{"Loading ..."}</span>{" "}
      </div>
    </>
  );
}

export default SpinnerLoader;
