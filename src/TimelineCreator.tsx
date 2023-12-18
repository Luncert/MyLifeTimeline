import { ResourceBrowser } from "./ResourceBrowser";

export default function TimelineCreator() {
  return (
    <div class="relative w-full h-full">
      <div class="w-full h-full" style={{
        "background-color": "white",
        "background-image": "radial-gradient(#e4e4e7 3px, #fafafa 1px)",
        "background-size": "50px 50px",
        "background-position": "-25px -25px",
      }}>

      </div>
      <ResourceBrowser />
    </div>
  )
}
