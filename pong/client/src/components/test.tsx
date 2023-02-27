import React from 'react';

// export function Animation() {
  
//   const animationByInterval = () => {
//     // Animation using setInterval
//     const start = Date.now();
//     const animatedText = document.querySelector('.myDiv') as Element;
//     const timer = setInterval(() => {
//       const interval = Date.now() - start;
//       animatedText.style.top = `${interval / 3}px`;
//       if (interval > 1000) clearInterval(timer);
//     }, 10);
//   };

//   let requestID: number
//   const startAnimation = () => {
//      // Animation using requestAnimationFrame
//     let start = Date.now();
//     const animatedText = document.querySelector('.myDiv') as Element;
    
//     function playAnimation() {
//       const interval = Date.now() - start;
//       animatedText.style.top = `${interval / 3}px`;
//       if (interval > 1000) {
//         start = Date.now();
//         animatedText.style.top = 0;
//       }
      
//       requestID = requestAnimationFrame(playAnimation);
//     }
//     requestAnimationFrame(playAnimation);
//   };

//   const stopAnimation = () => cancelAnimationFrame(requestID);

//   return (
//     <div>
//       <button onClick={startAnimation}>Start Animation Using requestAnimationFrame</button>
//       <button onClick={stopAnimation}>Stop Animation Using requestAnimationFrame</button>
//       <button onClick={animationByInterval}>Animation Using setInterval</button>
//       <div className="myDiv">Demo Page</div>
//     </div>
//   );
// }
