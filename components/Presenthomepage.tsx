import React from "react";
import  * as motion from "motion/react-client"

const Presenthomepage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="absolute top-80 left-10 z-10"
    >
      <motion.h1
        className="text-primary_heading font-bold text- font-sans text-5xl flex gap-5 flex-col"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <span className="">Global Academy of Technology</span>
        <span className="text-center">Present</span>
        <motion.span
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          VTU FEST
        </motion.span>
      </motion.h1>
    </motion.div>
  );
};

export default Presenthomepage;
