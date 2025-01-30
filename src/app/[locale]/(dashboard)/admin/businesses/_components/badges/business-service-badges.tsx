import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { BusinessService } from '@prisma/client'
import { useTranslations } from 'next-intl'

/**
 * Component to display a list of service badges with tooltip functionality.
 */
export const BusinessServiceBadges = ({
  services,
  cap = 2
}: {
  services: Array<BusinessService>
  cap?: number
}) => {
  const t = useTranslations('SelectBusinessServices')

  const visibleServices = services.slice(0, cap)
  const remainingServices = services.slice(cap)

  // Background and text color mapping based on service type
  const bgColor: Record<string, string> = {
    HAIR: '#D0F4F7', // Light blue
    BEARD: '#F0E4D7', // Light brown
    NAIL: '#FEE2E2', // Light pink
    TATTOO: '#E0E0E0', // Light gray
    EYEBROW_EYELASH: '#E9D7F7', // Light purple
    EPILATION: '#FFF9C4', // Light yellow
    POTOX: '#B2DFDB', // Light teal
    PIERCING: '#F8D7DA' // Light red
  }

  const textColor: Record<string, string> = {
    HAIR: '#2C7A99', // Dark blue
    BEARD: '#6B4F1F', // Dark brown
    NAIL: '#D93D6E', // Dark pink
    TATTOO: '#616161', // Dark gray
    EYEBROW_EYELASH: '#6A3E99', // Dark purple
    EPILATION: '#FBC02D', // Dark yellow
    POTOX: '#00796B', // Dark teal
    PIERCING: '#C62828' // Dark red
  }

  return (
    <div className="flex items-center gap-x-2">
      {visibleServices.map((name) => (
        <Badge
          key={name}
          style={{
            backgroundColor: bgColor[name],
            color: textColor[name]
          }}
        >
          {t(name.toLowerCase())}
        </Badge>
      ))}
      {remainingServices.length > 0 && (
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
              +{remainingServices.length}
            </Badge>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="p-4 max-w-sm bg-popover text-popover-foreground border-gray-200 shadow-2xl"
          >
            <div className="flex flex-wrap gap-2">
              {remainingServices.map((name) => (
                <Badge
                  key={name}
                  style={{
                    backgroundColor: bgColor[name],
                    color: textColor[name]
                  }}
                >
                  {t(name.toLowerCase())}
                </Badge>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
