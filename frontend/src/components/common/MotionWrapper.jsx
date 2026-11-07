import { motion } from 'motion/react';

export function MotionDiv(props) {
  return <motion.div {...props} />;
}

export function MotionSpan(props) {
  return <motion.span {...props} />;
}

export function MotionTr(props) {
  return <motion.tr {...props} />;
}

export function MotionLabel(props) {
  return <motion.label {...props} />;
}

export function MotionButton({
  whileHover = { scale: 1.02 },
  whileTap = { scale: 0.97 },
  transition = { type: 'spring', stiffness: 380, damping: 28 },
  ...props
}) {
  return (
    <motion.button whileHover={whileHover} whileTap={whileTap} transition={transition} {...props} />
  );
}
