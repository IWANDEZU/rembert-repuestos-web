param(
  [Parameter(Mandatory = $true)][string]$InputPath,
  [Parameter(Mandatory = $true)][string]$OutputPath
)

Add-Type -AssemblyName System.Drawing

$source = [System.Drawing.Image]::FromFile($InputPath)
try {
  $side = [Math]::Max($source.Width, $source.Height)
  $canvas = New-Object System.Drawing.Bitmap($side, $side, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  try {
    $canvas.SetResolution($source.HorizontalResolution, $source.VerticalResolution)
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    try {
      $graphics.Clear([System.Drawing.Color]::White)
      $x = [int](($side - $source.Width) / 2)
      $y = [int](($side - $source.Height) / 2)
      $graphics.DrawImageUnscaled($source, $x, $y)
    }
    finally {
      $graphics.Dispose()
    }

    $canvas.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $canvas.Dispose()
  }
}
finally {
  $source.Dispose()
}
