import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

function getScrollableAncestors(node) {
  const scrollables = [];
  let parent = node?.parentElement;
  while (parent && parent !== document.body) {
    const style = getComputedStyle(parent);
    if (
      /(auto|scroll)/.test(style.overflow + style.overflowY + style.overflowX)
    ) {
      scrollables.push(parent);
    }
    parent = parent.parentElement;
  }
  scrollables.push(window);
  return scrollables;
}

const ButtonDropdown = ({
  buttonContent,
  options = [],
  disabled = false,
  className = "",
  buttonClassName = "",
  onOpenChange = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const reference = useRef(null);
  const floating = useRef(null);

  const updateMenuPosition = () => {
    if (reference.current) {
      const rect = reference.current.getBoundingClientRect();
      const menuWidth = floating.current?.offsetWidth || 200; // Estimate menu width
      const menuHeight = floating.current?.offsetHeight || 200;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      let newTop = rect.bottom + window.scrollY;
      let newLeft = rect.right + window.scrollX - menuWidth; // Align to right edge
      let upwards = false;

      if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
        upwards = true;
        newTop = rect.top + window.scrollY - menuHeight;
      }

      // Ensure dropdown stays within window bounds
      if (newLeft + menuWidth > window.innerWidth) {
        newLeft = window.innerWidth - menuWidth - 8; // Add padding
      } else if (newLeft < 0) {
        newLeft = rect.left + window.scrollX; // Fallback to left alignment
      }

      setMenuPosition({
        top: newTop,
        left: newLeft,
        width: menuWidth,
      });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();
    const scrollables = getScrollableAncestors(reference.current);
    const handleScrollOrResize = () => updateMenuPosition();

    scrollables.forEach((el) =>
      el.addEventListener("scroll", handleScrollOrResize, true)
    );
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      scrollables.forEach((el) =>
        el.removeEventListener("scroll", handleScrollOrResize, true)
      );
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        floating.current &&
        !floating.current.contains(event.target) &&
        reference.current &&
        !reference.current.contains(event.target)
      ) {
        setIsOpen(false);
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={reference}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex items-center transition-all duration-300
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${buttonClassName}
        `}
      >
        {buttonContent}
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={floating}
              initial={{
                opacity: 0,
                scale: 0.95,
                y: menuPosition.top > window.scrollY ? -10 : 10,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: menuPosition.top > window.scrollY ? -10 : 10,
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: menuPosition.top,
                left: menuPosition.left,
                width: menuPosition.width,
                zIndex: 9999,
                minWidth: "10rem",
              }}
              className="bg-white rounded-xl shadow-xl border border-gray-200"
            >
              <div className="p-2">
                {options.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenChange(false);
                      option.onClick?.(option.value);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left 
                      hover:bg-gray-100 transition-colors duration-200 rounded-md
                      ${option.danger ? "text-red-600" : "text-gray-900"}
                    `}
                  >
                    {option.icon &&
                      React.createElement(option.icon, {
                        className: "h-4 w-4",
                      })}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default ButtonDropdown;
