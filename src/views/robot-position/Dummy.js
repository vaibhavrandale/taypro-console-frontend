import React from "react";

const Dummy = () => {
  const count = () => {
    let count = 0;

    return function () {
      count++;
      console.log(count);
    };
  };
  let increment = count();

  increment();
  increment();
  increment();
  increment();
  increment();
  //closure is created when inner function remembers and can access variable from its outer function even after th outer function has finished executing
  return <div>Dummy</div>;
};

export default Dummy;
