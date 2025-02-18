import { throttle } from 'lodash'
import React, {
  ChangeEvent,
  MouseEvent,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Box, Flex, Grid, Slider, Text } from 'theme-ui'

import { OasisTheme } from '../../theme'
import { useBreakpointIndex } from '../../theme/useBreakpointIndex'
import { useTheme } from '../../theme/useThemeUI'

function getSliderBoxBoundaries(boxRef: RefObject<HTMLDivElement>) {
  const box = boxRef.current?.getBoundingClientRect()

  return { sliderBoxLeftBoundary: box?.left || 0, sliderBoxRightBoundary: box?.right || 0 }
}

const sliderDefaultBoundaries = {
  sliderBoxLeftBoundary: 0,
  sliderBoxRightBoundary: 0,
}

function convertValuesToPercents({
  value0,
  value1,
  max,
  min,
}: {
  value0: number
  value1: number
  max: number
  min: number
}) {
  return {
    value0InPercent: ((value0 - min) / (max - min)) * 100,
    value1InPercent: ((value1 - min) / (max - min)) * 100,
  }
}

function getSliderBackgroundGradient({
  theme,
  value0InPercent,
  value1InPercent,
}: {
  theme: OasisTheme
  value0InPercent: number
  value1InPercent: number
}) {
  const { colors } = theme
  return `linear-gradient(to right, ${colors.primaryAlt}  0%, ${colors.primaryAlt} ${value0InPercent}%,
    ${colors.sliderActiveFill} ${value0InPercent}%,  ${colors.sliderActiveFill} ${value1InPercent}%,
    ${colors.primaryAlt} ${value1InPercent}%, ${colors.primaryAlt} 100%)`
}

interface SliderValues {
  value0: number
  value1: number
}

interface SliderValueColors {
  value0: string
  value1: string
}

interface MultipleRangeSliderProps {
  min: number
  max: number
  onChange: (value: SliderValues) => void
  defaultValue: SliderValues
  valueColors: SliderValueColors
  leftDescription: ReactNode
  rightDescription: ReactNode
  middleMark?: { text: string; value: number }
  step?: number
  leftThumbColor?: string
  rightThumbColor?: string
  minDescription?: ReactNode
  maxDescription?: ReactNode
}

export function MultipleRangeSlider({
  min,
  max,
  onChange,
  defaultValue,
  valueColors,
  middleMark,
  step = 5,
  leftThumbColor = 'onWarning',
  rightThumbColor = 'onSuccess',
  leftDescription,
  rightDescription,
  minDescription = '',
  maxDescription = '',
}: MultipleRangeSliderProps) {
  const [sliderValue, setSliderValue] = useState(defaultValue)
  const [side, setSide] = useState('')
  const [sliderBoxBoundaries, setSliderBoxBoundaries] = useState(sliderDefaultBoundaries)
  const sliderBoxRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const breakpoint = useBreakpointIndex()

  const { value0, value1 } = sliderValue
  const mobile = breakpoint === 0

  useEffect(() => {
    const handleBoundariesUpdate = () => {
      const { sliderBoxLeftBoundary, sliderBoxRightBoundary } = getSliderBoxBoundaries(sliderBoxRef)
      setSliderBoxBoundaries({ sliderBoxLeftBoundary, sliderBoxRightBoundary })
    }
    handleBoundariesUpdate()

    window.addEventListener('resize', handleBoundariesUpdate)

    return () => {
      window.removeEventListener('resize', handleBoundariesUpdate)
    }
  }, [])

  useEffect(() => {
    if (middleMark) {
      const newValue = {
        value0: middleMark.value - step,
        value1: middleMark.value + step,
      }
      setSliderValue(newValue)
      onChange(newValue)
    }
  }, [middleMark?.value])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, slider: number) => {
      const newValue = Number(e.target.value)

      if (
        slider === 0 &&
        (newValue > value1 - step || (middleMark && newValue > middleMark.value - step))
      ) {
        return
      }

      if (
        slider === 1 &&
        (newValue < value0 + step || (middleMark && newValue < middleMark.value + step))
      ) {
        return
      }

      setSliderValue((prev) => ({ ...prev, [`value${slider}`]: newValue }))
      onChange({ ...sliderValue, [`value${slider}`]: newValue })
    },
    [step, value1, middleMark?.value],
  )

  const { value0InPercent, value1InPercent } = useMemo(
    () => convertValuesToPercents({ value0, value1, max, min }),
    [value0, value1, max, min],
  )

  const sliderBackground = useMemo(
    () => getSliderBackgroundGradient({ theme, value0InPercent, value1InPercent }),
    [value0InPercent, value1InPercent],
  )

  const middleMarkPercentagePosition = useMemo(
    () => (middleMark ? ((middleMark.value - min) / (max - min)) * 100 : 0),
    [middleMark?.value, min, max],
  )

  const handleMouseMove = useCallback(
    throttle((e: MouseEvent<HTMLDivElement>) => {
      const { sliderBoxLeftBoundary, sliderBoxRightBoundary } = sliderBoxBoundaries
      const mouseXPosition =
        ((e.clientX - sliderBoxLeftBoundary) / (sliderBoxRightBoundary - sliderBoxLeftBoundary)) *
        100
      const centralReference =
        middleMarkPercentagePosition || (value0InPercent + value1InPercent) / 2

      if (mouseXPosition > centralReference) {
        setSide('right')
      } else {
        setSide('left')
      }
    }, 100),
    [sliderBoxBoundaries, value0InPercent, value1InPercent, middleMarkPercentagePosition],
  )

  return (
    <Box>
      <Box>
        <Flex
          sx={{
            variant: 'text.paragraph4',
            justifyContent: 'space-between',
            fontWeight: 'semiBold',
            color: 'text.subtitle',
            mb: '24px',
          }}
        >
          <Grid gap={2}>
            <Text>{leftDescription}</Text>
            <Text variant="paragraph1" sx={{ fontWeight: 'semiBold', color: valueColors.value0 }}>
              {value0}%
            </Text>
          </Grid>
          <Grid gap={2}>
            <Text>{rightDescription}</Text>
            <Text
              variant="paragraph1"
              sx={{ fontWeight: 'semiBold', textAlign: 'right', color: valueColors.value1 }}
            >
              {value1}%
            </Text>
          </Grid>
        </Flex>
      </Box>
      <Box onMouseMove={handleMouseMove} ref={sliderBoxRef} sx={{ position: 'relative', mb: 3 }}>
        <Slider
          step={step}
          min={min}
          max={max}
          value={value0}
          onChange={(e) => handleChange(e, 0)}
          sx={{
            pointerEvents: side === 'left' && !mobile ? 'all' : 'none',
            background: sliderBackground,
            '&::-webkit-slider-thumb': {
              backgroundColor: leftThumbColor,
              pointerEvents: 'all',
            },
          }}
        />
        <Slider
          step={step}
          min={min}
          max={max}
          value={value1}
          onChange={(e) => handleChange(e, 1)}
          sx={{
            position: 'absolute',
            top: '-7px',
            pointerEvents: side === 'right' && !mobile ? 'all' : 'none',
            backgroundColor: 'unset',
            '&::-webkit-slider-thumb': {
              backgroundColor: rightThumbColor,
              pointerEvents: 'all',
            },
          }}
        />
        {middleMark && (
          <Box
            sx={{
              position: 'absolute',
              top: '-13px',
              left: `50%`,
              transform: 'translateX(-50%)',
              width: 'calc(100% - 20px)',
              height: '30px',
              pointerEvents: 'none',
            }}
          >
            <Box sx={{ position: 'relative', width: '100%' }}>
              <Box
                sx={{
                  position: 'absolute',
                  width: '3px',
                  height: '30px',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'sliderActiveFill',
                  left: `${middleMarkPercentagePosition}%`,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  transform: 'translateX(-50%)',
                  left: `${middleMarkPercentagePosition}%`,
                  top: '-18px',
                  variant: 'text.paragraph4',
                  fontWeight: 'semiBold',
                }}
              >
                {middleMark.text}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box>
        <Flex
          sx={{
            variant: 'text.paragraph4',
            justifyContent: 'space-between',
            color: 'text.subtitle',
          }}
        >
          <Text>
            {min}% {minDescription}
          </Text>
          <Text>
            {max}% {maxDescription}
          </Text>
        </Flex>
      </Box>
    </Box>
  )
}
