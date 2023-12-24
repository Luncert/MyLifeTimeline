
export default function CurvedPathGallery() {
  return (
    <div class="relative w-full h-full shrink">
      <img src="https://placekitten.com/320/200"
        class="absolute h-50 left-0 z-0 drop-shadow hoveredImage"
        style={{
        "offset-path": "path('m 0 50 q 50-30 100-30 t 100 30 100 0 100-30 100 30')",
        "transition": "transform .4s ease-out, offset-path .4s cubic-bezier(.77,-1.17,.75,.84),box-shadow .3s, z-index .3s"
      }} />
    </div>
  )
}