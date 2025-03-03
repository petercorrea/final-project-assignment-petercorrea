import { cn } from '@/root/libs/cn';
import * as DialogPrimitive from '@kobalte/core/dialog';
import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import type { ComponentProps, ParentProps, ValidComponent } from 'solid-js';
import { splitProps } from 'solid-js';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

type DialogOverlayProps = DialogPrimitive.DialogOverlayProps & {
  class?: string
}

export const DialogOverlay = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DialogOverlayProps>
) => {
  const [local, rest] = splitProps(props as DialogOverlayProps, ['class']);

  return (
    <DialogPrimitive.Overlay
      class={cn(
        'fixed inset-0 z-50 bg-white/80 backdrop-blur-sm data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 dark:bg-slate-950/80',
        local.class
      )}
      {...rest}
    />
  );
};

type DialogContentProps = ParentProps<
  DialogPrimitive.DialogOverlayProps & {
    class?: string
  }
>

export const DialogContent = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DialogContentProps>
) => {
  const [local, rest] = splitProps(props as DialogContentProps, [
    'class',
    'children',
  ]);

  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <DialogPrimitive.Content
          class={cn(
            'max-h-[90vh] overflow-x-scroll fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 data-[closed]:slide-out-to-left-1/2 data-[closed]:slide-out-to-top-[48%] data-[expanded]:slide-in-from-left-1/2 data-[expanded]:slide-in-from-top-[48%] sm:rounded-lg md:w-full dark:border-slate-800 dark:bg-slate-950',
            local.class
          )}
          {...rest}
        >
          {local.children}
          <DialogPrimitive.CloseButton class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-[opacity,box-shadow] hover:opacity-100 focus:outline-none focus:ring-[1.5px] focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-slate-950 dark:focus:ring-slate-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 24"
              class="h-4 w-4"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 6L6 18M6 6l12 12"
              />
            </svg>
            <span class="sr-only">Close</span>
          </DialogPrimitive.CloseButton>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
};

type DialogTitleProps = DialogPrimitive.DialogTitleProps & {
  class?: string
}

export const DialogTitle = <T extends ValidComponent = 'h2'>(
  props: PolymorphicProps<T, DialogTitleProps>
) => {
  const [local, rest] = splitProps(props as DialogTitleProps, ['class']);

  return (
    <DialogPrimitive.Title
      class={cn(
        'text-lg font-semibold text-slate-950 dark:text-slate-50',
        local.class
      )}
      {...rest}
    />
  );
};

type DialogDescriptionProps = DialogPrimitive.DialogDescriptionProps & {
  class?: string
}

export const DialogDescription = <T extends ValidComponent = 'p'>(
  props: PolymorphicProps<T, DialogDescriptionProps>
) => {
  const [local, rest] = splitProps(props as DialogDescriptionProps, ['class']);

  return (
    <DialogPrimitive.Description
      class={cn('text-sm text-slate-500 dark:text-slate-400', local.class)}
      {...rest}
    />
  );
};

export const DialogHeader = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class']);
  return (
    <div
      class={cn(
        'flex flex-col space-y-2 text-center sm:text-left',
        local.class
      )}
      {...rest}
    />
  );
};

export const DialogFooter = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class']);
  return (
    <div
      class={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        local.class
      )}
      {...rest}
    />
  );
};
