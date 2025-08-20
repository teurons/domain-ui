"use client";

import { ChevronRight, Folder, FolderOpen } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useState,
} from "react";
import { cn } from "@workspace/domain-ui-registry/lib/utils";

type TreeContextType = {
  expandedIds: Set<string>;
  selectedIds: string[];
  toggleExpanded: (nodeId: string) => void;
  handleSelection: (nodeId: string, ctrlKey: boolean) => void;
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  indent?: number;
  animateExpand?: boolean;
};

const TreeContext = createContext<TreeContextType | undefined>(undefined);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("Tree components must be used within a TreeProvider");
  }
  return context;
};

type TreeNodeContextType = {
  nodeId: string;
  level: number;
  isLast: boolean;
  parentPath: boolean[];
};

const TreeNodeContext = createContext<TreeNodeContextType | undefined>(
  undefined
);

const useTreeNode = () => {
  const context = useContext(TreeNodeContext);
  if (!context) {
    throw new Error("TreeNode components must be used within a TreeNode");
  }
  return context;
};

export type TreeProviderProps = {
  children: ReactNode;
  defaultExpandedIds?: string[];
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  indent?: number;
  animateExpand?: boolean;
  className?: string;
};

export const TreeProvider = ({
  children,
  defaultExpandedIds = [],
  showLines = true,
  showIcons = true,
  selectable = true,
  multiSelect = false,
  selectedIds,
  onSelectionChange,
  indent = 19, // Matching tree-view indent
  animateExpand = true,
  className,
}: TreeProviderProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(defaultExpandedIds)
  );
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(
    selectedIds ?? []
  );

  const isControlled =
    selectedIds !== undefined && onSelectionChange !== undefined;
  const currentSelectedIds = isControlled ? selectedIds : internalSelectedIds;

  const toggleExpanded = useCallback((nodeId: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const handleSelection = useCallback(
    (nodeId: string, ctrlKey = false) => {
      if (!selectable) {
        return;
      }

      let newSelection: string[];

      if (multiSelect && ctrlKey) {
        newSelection = currentSelectedIds.includes(nodeId)
          ? currentSelectedIds.filter((id) => id !== nodeId)
          : [...currentSelectedIds, nodeId];
      } else {
        newSelection = currentSelectedIds.includes(nodeId) ? [] : [nodeId];
      }

      if (isControlled) {
        onSelectionChange?.(newSelection);
      } else {
        setInternalSelectedIds(newSelection);
      }
    },
    [
      selectable,
      multiSelect,
      currentSelectedIds,
      isControlled,
      onSelectionChange,
    ]
  );

  return (
    <TreeContext.Provider
      value={{
        expandedIds,
        selectedIds: currentSelectedIds,
        toggleExpanded,
        handleSelection,
        showLines,
        showIcons,
        selectable,
        multiSelect,
        indent,
        animateExpand,
      }}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={cn("w-full", className)}
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </TreeContext.Provider>
  );
};

export type TreeViewProps = HTMLAttributes<HTMLDivElement>;

export const TreeView = ({ className, children, ...props }: TreeViewProps) => (
  <div className={cn(className)} {...props}>
    {children}
  </div>
);

export type TreeNodeProps = HTMLAttributes<HTMLDivElement> & {
  nodeId?: string;
  level?: number;
  isLast?: boolean;
  parentPath?: boolean[];
  children?: ReactNode;
};

export const TreeNode = ({
  nodeId: providedNodeId,
  level = 0,
  isLast = false,
  parentPath = [],
  children,
  className,
  onClick,
  ...props
}: TreeNodeProps) => {
  const generatedId = useId();
  const nodeId = providedNodeId ?? generatedId;

  // Build the parent path - mark positions where the parent was the last child
  const currentPath = level === 0 ? [] : [...parentPath];
  if (level > 0 && parentPath.length < level - 1) {
    // Fill in missing levels with false (not last)
    while (currentPath.length < level - 1) {
      currentPath.push(false);
    }
  }
  if (level > 0) {
    currentPath[level - 1] = isLast;
  }

  return (
    <TreeNodeContext.Provider
      value={{
        nodeId,
        level,
        isLast,
        parentPath: currentPath,
      }}
    >
      <div className={cn("select-none", className)} {...props}>
        {children}
      </div>
    </TreeNodeContext.Provider>
  );
};

export type TreeNodeTriggerProps = ComponentProps<typeof motion.div>;

export const TreeNodeTrigger = ({
  children,
  className,
  onClick,
  ...props
}: TreeNodeTriggerProps) => {
  const { selectedIds, toggleExpanded, handleSelection, expandedIds } =
    useTree();
  const { nodeId, level } = useTreeNode();
  const isSelected = selectedIds.includes(nodeId);
  const isExpanded = expandedIds.has(nodeId);

  return (
    <motion.div
      aria-selected={isSelected}
      aria-expanded={isExpanded}
      className={cn(
        // Matching tree-view styles exactly
        "group relative flex h-[28px] cursor-pointer select-none items-center gap-1.5 text-foreground-light text-sm transition-colors hover:bg-control aria-expanded:bg-transparent data-[state=open]:bg-transparent",
        isSelected && "!bg-selection text-foreground",
        className
      )}
      onClick={(e) => {
        toggleExpanded(nodeId);
        handleSelection(nodeId, e.ctrlKey || e.metaKey);
        onClick?.(e);
      }}
      style={{
        paddingLeft: 24 + ((level - 1) * 38) / 2, // Increased base padding to match tree-view visual spacing
      }}
      whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
      {...props}
    >
      <TreeLines />
      {children as ReactNode}
    </motion.div>
  );
};

export const TreeLines = () => {
  const { showLines, selectedIds } = useTree();
  const { level, nodeId } = useTreeNode();
  const isSelected = selectedIds.includes(nodeId);

  const CHEVRON_ICON_SIZE = 14;

  return (
    <>
      {/* Render vertical lines for all parent levels - matching tree-view exactly */}
      {showLines &&
        Array.from({ length: level - 1 }).map((_, i) => (
          <div
            key={i}
            style={{
              left: 24 + (i * 38) / 2 + CHEVRON_ICON_SIZE / 2,
            }}
            className={"absolute h-full w-px bg-border-strong"}
          />
        ))}
      {isSelected && (
        <div className="absolute left-0 h-full w-0.5 bg-foreground" />
      )}
    </>
  );
};

export type TreeNodeContentProps = ComponentProps<typeof motion.div> & {
  hasChildren?: boolean;
};

export const TreeNodeContent = ({
  children,
  hasChildren = false,
  className,
  ...props
}: TreeNodeContentProps) => {
  const { animateExpand, expandedIds } = useTree();
  const { nodeId } = useTreeNode();
  const isExpanded = expandedIds.has(nodeId);

  return (
    <AnimatePresence>
      {hasChildren && isExpanded && (
        <motion.div
          animate={{ height: "auto", opacity: 1 }}
          className="overflow-hidden"
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0 }}
          transition={{
            duration: animateExpand ? 0.3 : 0,
            ease: "easeInOut",
          }}
        >
          <motion.div
            animate={{ y: 0 }}
            className={className}
            exit={{ y: -10 }}
            initial={{ y: -10 }}
            transition={{
              duration: animateExpand ? 0.2 : 0,
              delay: animateExpand ? 0.1 : 0,
            }}
            {...props}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export type TreeExpanderProps = ComponentProps<typeof motion.div> & {
  hasChildren?: boolean;
};

export const TreeExpander = ({
  hasChildren = false,
  className,
  onClick,
  ...props
}: TreeExpanderProps) => {
  const { expandedIds, toggleExpanded } = useTree();
  const { nodeId } = useTreeNode();
  const isExpanded = expandedIds.has(nodeId);

  // For files (no children), don't render anything
  if (!hasChildren) {
    return null;
  }

  return (
    <motion.div
      animate={{ rotate: isExpanded ? 90 : 0 }}
      className={cn("flex items-center justify-center", className)}
      onClick={(e) => {
        e.stopPropagation();
        toggleExpanded(nodeId);
        onClick?.(e);
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      {...props}
    >
      {/* Matching tree-view chevron styles */}
      <ChevronRight
        className={cn(
          "text-foreground-muted",
          "group-aria-selected:text-foreground-light",
          "group-aria-expanded:text-foreground-light",
          "transition-transform duration-200"
        )}
        size={14}
        strokeWidth={1.5}
      />
    </motion.div>
  );
};

export type TreeIconProps = ComponentProps<typeof motion.div> & {
  icon?: ReactNode;
  hasChildren?: boolean;
};

export const TreeIcon = ({
  icon,
  hasChildren = false,
  className,
  ...props
}: TreeIconProps) => {
  const { showIcons, expandedIds } = useTree();
  const { nodeId } = useTreeNode();
  const isExpanded = expandedIds.has(nodeId);

  if (!showIcons) {
    return null;
  }

  const getDefaultIcon = () =>
    hasChildren ? (
      isExpanded ? (
        <FolderOpen
          className={cn(
            "transition-colors",
            "text-foreground-muted",
            "group-aria-selected:text-foreground-light",
            "group-aria-expanded:text-foreground-light"
          )}
          size={16}
          strokeWidth={1.5}
        />
      ) : (
        <Folder
          className={cn(
            "transition-colors",
            "text-foreground-muted",
            "group-aria-selected:text-foreground-light",
            "group-aria-expanded:text-foreground-light"
          )}
          size={16}
          strokeWidth={1.5}
        />
      )
    ) : (
      icon || (
        <SQL_ICON
          className={cn(
            "transition-colors",
            "fill-foreground-muted",
            "group-aria-selected:fill-foreground",
            "h-5 w-5 shrink-0",
            "-ml-0.5"
          )}
          size={16}
          strokeWidth={1.5}
        />
      )
    );

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      {getDefaultIcon()}
    </div>
  );
};

export type TreeLabelProps = HTMLAttributes<HTMLSpanElement>;

export const TreeLabel = ({ className, ...props }: TreeLabelProps) => (
  <span className={cn("truncate text-sm", className)} {...props} />
);

// Define a custom type for SVG components including the size prop
interface LucideSVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const SQL_ICON = (props: LucideSVGProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1018_49117)">
      <path d="M20.8457 14.4531V15.6348H17.8916V14.4531H20.8457ZM18.3311 8.52539V15.6348H16.9004V8.52539H18.3311Z" />
      <path d="M13.6865 14.5508L15.3857 16.084L14.4873 16.9092L12.8271 15.376L13.6865 14.5508ZM15.3564 11.5283V12.6318C15.3564 13.1429 15.2962 13.5938 15.1758 13.9844C15.0553 14.3717 14.8812 14.6956 14.6533 14.9561C14.4255 15.2132 14.1553 15.4069 13.8428 15.5371C13.5303 15.6673 13.1836 15.7324 12.8027 15.7324C12.4219 15.7324 12.0736 15.6673 11.7578 15.5371C11.4453 15.4069 11.1751 15.2132 10.9473 14.9561C10.7227 14.6956 10.5469 14.3717 10.4199 13.9844C10.2962 13.5938 10.2344 13.1429 10.2344 12.6318V11.5283C10.2344 11.0173 10.2962 10.568 10.4199 10.1807C10.5436 9.79329 10.7178 9.47103 10.9424 9.21387C11.1702 8.95345 11.4404 8.75814 11.7529 8.62793C12.0654 8.49447 12.4121 8.42773 12.793 8.42773C13.1771 8.42773 13.5254 8.49447 13.8379 8.62793C14.1504 8.75814 14.4206 8.95345 14.6484 9.21387C14.8796 9.47103 15.0553 9.79329 15.1758 10.1807C15.2962 10.568 15.3564 11.0173 15.3564 11.5283ZM13.9307 12.6318V11.5186C13.9307 11.1833 13.9062 10.8952 13.8574 10.6543C13.8086 10.4134 13.7354 10.2165 13.6377 10.0635C13.5433 9.91048 13.4245 9.79818 13.2812 9.72656C13.1413 9.65495 12.9785 9.61914 12.793 9.61914C12.6107 9.61914 12.4479 9.65495 12.3047 9.72656C12.1647 9.79818 12.0475 9.91048 11.9531 10.0635C11.8587 10.2165 11.7855 10.4134 11.7334 10.6543C11.6846 10.8952 11.6602 11.1833 11.6602 11.5186V12.6318C11.6602 12.9704 11.6846 13.2601 11.7334 13.501C11.7822 13.7419 11.8538 13.9404 11.9482 14.0967C12.0459 14.2497 12.1647 14.3636 12.3047 14.4385C12.4479 14.5101 12.6139 14.5459 12.8027 14.5459C12.985 14.5459 13.1462 14.5101 13.2861 14.4385C13.4294 14.3636 13.5482 14.2497 13.6426 14.0967C13.7402 13.9437 13.8118 13.7467 13.8574 13.5059C13.9062 13.2617 13.9307 12.9704 13.9307 12.6318Z" />
      <path d="M7.47266 13.7646C7.47266 13.6377 7.46126 13.5221 7.43848 13.418C7.41569 13.3138 7.36686 13.2178 7.29199 13.1299C7.22038 13.042 7.11458 12.9541 6.97461 12.8662C6.83789 12.7783 6.65885 12.6872 6.4375 12.5928C6.17383 12.4821 5.91829 12.3649 5.6709 12.2412C5.4235 12.1143 5.20052 11.9678 5.00195 11.8018C4.80339 11.6357 4.64551 11.4404 4.52832 11.2158C4.41439 10.988 4.35742 10.721 4.35742 10.415C4.35742 10.1156 4.41113 9.84375 4.51855 9.59961C4.62923 9.35547 4.78548 9.14714 4.9873 8.97461C5.18913 8.79883 5.42513 8.66374 5.69531 8.56934C5.96875 8.47493 6.27311 8.42773 6.6084 8.42773C7.06413 8.42773 7.45801 8.52214 7.79004 8.71094C8.12533 8.89974 8.38411 9.15853 8.56641 9.4873C8.75195 9.81608 8.84473 10.1937 8.84473 10.6201H7.41895C7.41895 10.4183 7.38965 10.2409 7.33105 10.0879C7.27572 9.93164 7.1862 9.80957 7.0625 9.72168C6.9388 9.63379 6.7793 9.58984 6.58398 9.58984C6.40169 9.58984 6.25033 9.62728 6.12988 9.70215C6.0127 9.77376 5.9248 9.87305 5.86621 10C5.81087 10.1237 5.7832 10.2637 5.7832 10.4199C5.7832 10.5371 5.81087 10.6429 5.86621 10.7373C5.9248 10.8285 6.00456 10.9115 6.10547 10.9863C6.20638 11.0579 6.3252 11.1279 6.46191 11.1963C6.60189 11.2646 6.75488 11.3314 6.9209 11.3965C7.24316 11.5234 7.52799 11.6634 7.77539 11.8164C8.02279 11.9661 8.22949 12.1354 8.39551 12.3242C8.56152 12.5098 8.68685 12.7197 8.77148 12.9541C8.85612 13.1885 8.89844 13.4554 8.89844 13.7549C8.89844 14.0511 8.84635 14.3213 8.74219 14.5654C8.64128 14.8063 8.49316 15.0146 8.29785 15.1904C8.10254 15.363 7.86654 15.4964 7.58984 15.5908C7.31641 15.6852 7.01042 15.7324 6.67188 15.7324C6.3431 15.7324 6.03223 15.6868 5.73926 15.5957C5.44629 15.5013 5.1875 15.3597 4.96289 15.1709C4.74154 14.9788 4.56738 14.7363 4.44043 14.4434C4.31348 14.1471 4.25 13.7972 4.25 13.3936H5.68066C5.68066 13.6084 5.70182 13.7923 5.74414 13.9453C5.78646 14.0951 5.85156 14.2155 5.93945 14.3066C6.02734 14.3945 6.13477 14.4613 6.26172 14.5068C6.39193 14.5492 6.54004 14.5703 6.70605 14.5703C6.89486 14.5703 7.0446 14.5345 7.15527 14.4629C7.26921 14.3913 7.35059 14.2952 7.39941 14.1748C7.44824 14.0544 7.47266 13.9176 7.47266 13.7646Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.5 5.73438H4.5C3.11929 5.73438 2 6.85366 2 8.23438V16.5039C2 17.8846 3.11929 19.0039 4.5 19.0039H20.5C21.8807 19.0039 23 17.8846 23 16.5039V8.23438C23 6.85366 21.8807 5.73438 20.5 5.73438ZM4.5 4.23438C2.29086 4.23438 0.5 6.02524 0.5 8.23438V16.5039C0.5 18.713 2.29086 20.5039 4.5 20.5039H20.5C22.7091 20.5039 24.5 18.713 24.5 16.5039V8.23438C24.5 6.02524 22.7091 4.23438 20.5 4.23438H4.5Z"
      />
    </g>
    <defs>
      <clipPath id="clip0_1018_49117">
        <rect width="24" height="24" transform="translate(0.5 0.269531)" />
      </clipPath>
    </defs>
  </svg>
);

export { SQL_ICON };
