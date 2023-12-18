import { JSX, createContext, createEffect, createMemo, splitProps } from "solid-js";
import { createData, useCtx } from "./utils";
import { Button, styled, useTheme } from "@suid/material";
import { ButtonProps } from "@suid/material/Button";

interface TabsContextDef {
  selected: Data<string>;
}

const TabsContext = createContext<TabsContextDef>();

function useTabs() {
  return useCtx<TabsContextDef>(TabsContext as any);
}

export function Tabs(props: {
  value: string;
  onChangeTab?: (newValue: string) => void;
} & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["value", "onChangeTab", "children"])
  const selected = createData(local.value);
  createEffect(() => {
    if (local.onChangeTab) {
      local.onChangeTab(selected());
    }
  })
  return (
    <TabsContext.Provider value={{selected}}>
      <Container {...others}>
        {local.children}
      </Container>
    </TabsContext.Provider>
  )
}

const Container = styled('div')(({ theme }) => ({
  display: "flex",
  gap: "0.5rem",
  borderBottomWidth: "1px",
  borderBottomColor: theme.palette.mode === "light" ? "#cbd5e1" : "#475569"
}));

export function Tab(props: {
  label: string;
} & ButtonProps) {
  const ctx = useTabs();
  const isSelected = createMemo(() => ctx.selected() === props.label);
  const theme = useTheme();

  return (
    <Button
      onClick={() => ctx.selected(props.label)}
      sx={{
        color: isSelected() ? theme.palette.primary.main : theme.palette.text.disabled,
        fontWeight: 700,
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: isSelected() ? theme.palette.primary.main : 'rgba(0, 0, 0, 0)',
        borderRadius: 0,
      }}>
      {props.children}
    </Button>
  )
}