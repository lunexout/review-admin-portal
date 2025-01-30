import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { BusinessPriceTier } from '@prisma/client'
import { useTranslations } from 'next-intl'

export const BusinessPriceBadges = ({
  prices,
  cap = 1
}: {
  prices: Array<BusinessPriceTier>
  cap?: number
}) => {
  const t = useTranslations('SelectBusinessPriceTiers')

  const bgColor: Record<BusinessPriceTier, string> = {
    LOW: '#FEECEB',
    NORMAL: '#FFF2E5',
    HIGH: '#EDF8F5',
    LUXURY: '#F3E8FF'
  }

  const textColor: Record<BusinessPriceTier, string> = {
    LOW: '#F04438',
    NORMAL: '#FF8200',
    HIGH: '#00AB75',
    LUXURY: '#7C3AED'
  }

  // Ensure prices are sorted: LOW -> NORMAL -> HIGH -> LUXURY
  const sortedPrices = prices.sort((a, b) => {
    const order: BusinessPriceTier[] = ['LOW', 'NORMAL', 'HIGH', 'LUXURY']
    return order.indexOf(a) - order.indexOf(b)
  })

  const visiblePrices = sortedPrices.slice(0, cap)
  const remainingPrices = sortedPrices.slice(cap)

  return (
    <div className="flex items-center gap-x-2">
      {visiblePrices.map((price) => (
        <Badge
          key={price}
          style={{
            backgroundColor: bgColor[price],
            color: textColor[price]
          }}
        >
          {t(price.toLowerCase())}
        </Badge>
      ))}
      {remainingPrices.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="cursor-pointer"
              style={{
                border: '1px solid #ddd',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              +{remainingPrices.length}
            </Badge>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="p-4 max-w-sm bg-popover text-popover-foreground border-gray-200 shadow-2xl"
          >
            <div className="flex flex-wrap gap-2">
              {remainingPrices.map((price) => (
                <Badge
                  key={price}
                  style={{
                    backgroundColor: bgColor[price],
                    color: textColor[price]
                  }}
                >
                  {t(price.toLowerCase())}
                </Badge>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
