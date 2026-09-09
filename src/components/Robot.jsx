// eslint-disable-next-line no-unused-vars
import React from "react";

import robotImg from "../assets/robot.png";
import girlImg from "../assets/girl.png";

function Robot() {
  return (
    <>
      <style>
        {`
          .bottom-section {
            position: relative;
            width: 100%;
            height: 130px;
            margin-top: 0 auto;
          }

          .robot {
            position: absolute;
            bottom: 0;
            left: 120px;
            width: 110px;
            animation: float 3s ease-in-out infinite;
          }

          .girl {
            position: absolute;
            bottom: 90;
            
            right: 160px;
            width: 100px;
            animation: float 3s ease-in-out infinite;
          }

          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }

          @media (max-width: 768px) {
            .bottom-section {
              height: 85px;
            }

            .robot {
              width: 85px;
              left: 15px;
            }

            .girl {
              width: 85px;
              right: 15px;
            }
          }
        `}
      </style>

      <div className="bottom-section">
        <img src={robotImg} alt="robot" className="robot" />
        <img src={girlImg} alt="girl" className="girl" />
      </div>
    </>
  );
}

export default Robot;