# Photorealistic launcher + favicon from public/images/boston.jpg (Boston harbor skyline).
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $root "public\images\boston.jpg"
$resRoot = Join-Path $root "android\app\src\main\res"
$publicRoot = Join-Path $root "public"

if (-not (Test-Path $sourcePath)) {
    Write-Error "Missing source photo: $sourcePath"
    exit 1
}

$mipmapSizes = [ordered]@{
    "mipmap-mdpi"    = 48
    "mipmap-hdpi"    = 72
    "mipmap-xhdpi"   = 96
    "mipmap-xxhdpi"  = 144
    "mipmap-xxxhdpi" = 192
}

function Get-CenterSquareCrop {
    param([System.Drawing.Image]$Image)
    $size = [Math]::Min($Image.Width, $Image.Height)
    $x = [int](($Image.Width - $size) / 2)
    $y = [int](($Image.Height - $size) / 2)
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $src = New-Object System.Drawing.Rectangle $x, $y, $size, $size
    $dst = New-Object System.Drawing.Rectangle 0, 0, $size, $size
    $g.DrawImage($Image, $dst, $src, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    return $bmp
}

function Resize-Bitmap {
    param(
        [System.Drawing.Bitmap]$Bitmap,
        [int]$Size
    )
    if ($Bitmap.Width -eq $Size -and $Bitmap.Height -eq $Size) {
        return $Bitmap
    }
    $out = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($out)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($Bitmap, 0, 0, $Size, $Size)
    $g.Dispose()
    return $out
}

function Save-Png {
    param(
        [System.Drawing.Bitmap]$Bitmap,
        [string]$Path
    )
    $dir = Split-Path $Path -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
}

$source = [System.Drawing.Image]::FromFile($sourcePath)
$square = Get-CenterSquareCrop -Image $source
$source.Dispose()

# Master copy for future edits
Save-Png -Bitmap $square -Path (Join-Path $publicRoot "icons\boston-icon-1024.png")
$master = Resize-Bitmap -Bitmap $square -Size 1024
if ($master -ne $square) { $square.Dispose(); $square = $master }

# Web favicons
foreach ($entry in @(@{ name = "favicon.png"; size = 512 }, @{ name = "favicon-32.png"; size = 32 }, @{ name = "apple-touch-icon.png"; size = 180 })) {
    $scaled = Resize-Bitmap -Bitmap $square -Size $entry.size
    Save-Png -Bitmap $scaled -Path (Join-Path $publicRoot $entry.name)
    if ($scaled -ne $square) { $scaled.Dispose() }
}

# Android mipmaps
foreach ($entry in $mipmapSizes.GetEnumerator()) {
    $folder = Join-Path $resRoot $entry.Key
  $scaled = Resize-Bitmap -Bitmap $square -Size $entry.Value
    foreach ($name in @("ic_launcher.png", "ic_launcher_round.png", "ic_launcher_foreground.png")) {
        Save-Png -Bitmap $scaled -Path (Join-Path $folder $name)
    }
    if ($scaled -ne $square) { $scaled.Dispose() }
    Write-Host "Wrote $($entry.Key) ($($entry.Value)px)"
}

$square.Dispose()
Write-Host "Photo icons generated from boston.jpg"
