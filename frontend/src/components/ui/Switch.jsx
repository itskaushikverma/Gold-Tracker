import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { cn } from 'cn';

function Switch({ className, ...props }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer group/switch focus-visible:border-ring focus-visible:ring-ring/50 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 relative inline-flex h-[18.4px] w-[32px] shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="bg-background dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform group-data-checked/switch:translate-x-[calc(100%-2px)] group-data-unchecked/switch:translate-x-0"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
