# Generates Boston launcher PNGs for legacy mipmap densities (API 24-25).
# Composes the same layers as the adaptive icon drawables.
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$resRoot = Join-Path $root "android\app\src\main\res"

$sizes = [ordered]@{
    "mipmap-mdpi"    = 48
    "mipmap-hdpi"    = 72
    "mipmap-xhdpi"   = 96
    "mipmap-xxhdpi"  = 144
    "mipmap-xxxhdpi" = 192
}

function New-Brush {
    param($A, $R, $G, $B)
    New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($A, $R, $G, $B))
}

function Draw-BostonIcon {
    param([int]$Size)
    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $s = $Size / 108.0
    $x = { param($v) [single]($v * $s) }

    # Background — harbor blue + waves
    $g.Clear([System.Drawing.Color]::FromArgb(255, 30, 95, 140))
    $wave1 = New-Object System.Drawing.Drawing2D.GraphicsPath
    $wave1.AddBezier((&$x 0), (&$x 72), (&$x 18), (&$x 66), (&$x 54), (&$x 68), (&$x 90), (&$x 66))
    $wave1.AddBezier((&$x 90), (&$x 66), (&$x 99), (&$x 70), (&$x 108), (&$x 72), (&$x 108), (&$x 72))
    $wave1.AddLine((&$x 108), (&$x 108), (&$x 0), (&$x 108))
    $wave1.CloseFigure()
    $b1 = New-Brush 255 23 74 114
    $g.FillPath($b1, $wave1)
    $b1.Dispose()
    $wave1.Dispose()

    $wave2 = New-Object System.Drawing.Drawing2D.GraphicsPath
    $wave2.AddBezier((&$x 0), (&$x 80), (&$x 27), (&$x 74), (&$x 54), (&$x 76), (&$x 81), (&$x 74))
    $wave2.AddBezier((&$x 81), (&$x 74), (&$x 99), (&$x 78), (&$x 108), (&$x 80), (&$x 108), (&$x 80))
    $wave2.AddLine((&$x 108), (&$x 108), (&$x 0), (&$x 108))
    $wave2.CloseFigure()
    $b2 = New-Brush 115 42 127 168
    $g.FillPath($b2, $wave2)
    $b2.Dispose()
    $wave2.Dispose()

    # Pedestal
    $ped = New-Brush 255 244 237 228
    $g.FillRectangle($ped, (&$x 34), (&$x 62), (&$x 40), (&$x 22))
    $ped.Dispose()

    # Drum
    $drum = New-Brush 255 232 184 74
    $g.FillRectangle($drum, (&$x 40), (&$x 48), (&$x 28), (&$x 14))
    $drum.Dispose()

    # Dome
    $domeRect = New-Object System.Drawing.RectangleF (&$x 28), (&$x 28), (&$x 52), (&$x 34)
    $gold = New-Brush 255 245 208 106
    $g.FillEllipse($gold, $domeRect)
    $gold.Dispose()

    # Highlight
    $hiRect = New-Object System.Drawing.RectangleF (&$x 38), (&$x 34), (&$x 28), (&$x 12)
    $hi = New-Brush 140 255 240 176
    $g.FillEllipse($hi, $hiRect)
    $hi.Dispose()

    # Finial
    $fin = New-Brush 255 255 240 176
    $g.FillRectangle($fin, (&$x 51), (&$x 22), (&$x 6), (&$x 8))
    $g.FillEllipse($fin, (&$x 50), (&$x 18), (&$x 8), (&$x 8))
    $fin.Dispose()

    $g.Dispose()
    return $bmp
}

foreach ($entry in $sizes.GetEnumerator()) {
    $folder = Join-Path $resRoot $entry.Key
    if (-not (Test-Path $folder)) { New-Item -ItemType Directory -Path $folder | Out-Null }
    $bmp = Draw-BostonIcon -Size $entry.Value
    foreach ($name in @("ic_launcher.png", "ic_launcher_round.png", "ic_launcher_foreground.png")) {
        $bmp.Save((Join-Path $folder $name), [System.Drawing.Imaging.ImageFormat]::Png)
    }
    $bmp.Dispose()
    Write-Host "Wrote $($entry.Key) ($($entry.Value)px)"
}

Write-Host "Done."
