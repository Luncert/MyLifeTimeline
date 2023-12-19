import { Accessor, JSX, Show, ValidComponent, createContext, createMemo } from "solid-js";
import { conditionalString, createData, names, useCtx } from "./utils";
import { Backdrop, useTheme } from "@suid/material";
import { Dynamic } from "solid-js/web";

interface BackdropOpts {
  elem?: ValidComponent;
  elemPos?: Pos;
  anchor?: HTMLElement;
  onClose?: Callback;
}
interface BackdropWrapperDef {
  show(opts?: BackdropOpts): void;
  hide(): void;
  loading(isLoading: boolean): void;
  container: Accessor<HTMLElement | undefined>;
}

const BackdropWrapperContext = createContext<BackdropWrapperDef>();

export function useBackdrop(): BackdropWrapperDef {
  return useCtx<BackdropWrapperDef>(BackdropWrapperContext as any);
}

export function BackdropWrapper(props: {
  children: JSX.Element;
  loader?: JSX.Element;
}) {
  const theme = useTheme();
  const data = createData<BackdropOpts| null>(null);
  const loading = createData(false);
  const contentOffset = createMemo(() => {
    const d = data();
    if (d?.anchor) {
      const rect = d.anchor.getBoundingClientRect();
      return [rect.x, rect.y + rect.height, true];
    }
    if (d?.elemPos) {
      return [d.elemPos[0], d.elemPos[1], true];
    }
    return [0, 0, false];
  });
  const container = createData<HTMLElement | undefined>(undefined);
  return (
    <BackdropWrapperContext.Provider value={{
      show: (opts) => data(opts),
      hide: () => data(null),
      loading, container}}>
      {props.children}
      <Backdrop
        sx={{ zIndex: theme.zIndex.drawer + 1 }}
        open={Boolean(data()) || loading()}
        invisible
        onClick={() => {
          const d = data();
          d?.onClose?.();
          data(null);
        }}
      />
      <Show when={Boolean(data())}>
        <div ref={el => container(el)} class="portal-container absolute w-max h-max" style={{
          "z-index": theme.zIndex.drawer + 2,
          left: contentOffset()[2] ? `${contentOffset()[0]}px` : "50%",
          top: contentOffset()[2] ? `${contentOffset()[1]}px` : "50%",
        }}>
          { data()?.elem && <Dynamic component={data()?.elem} /> }
        </div>
      </Show>
      {/* <Show when={loading()}>
        <div class="absolute top-1/2 left-1/2" style={{
          "z-index": theme.zIndex.drawer + 2
        }}>
          <div class="-translate-x-1/2 -translate-y-1/2">
            {props.loader || <Loader />}
          </div>
        </div>
      </Show> */}
    </BackdropWrapperContext.Provider>
  )
}