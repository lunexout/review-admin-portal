import type { UserStatus } from '@prisma/client'
import { useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'

type UserStatusBadgeProps = {
  userStatus: UserStatus
  size?: 'default' | 'small'
}

const statusBgColorFaded: Record<UserStatusBadgeProps['userStatus'], string> = {
  ACTIVE: '#EDF8F5',
  INACTIVE: '#FEECEB',
  PENDING: '#FFF2E5'
}

const statusColorFaded: Record<UserStatusBadgeProps['userStatus'], string> = {
  ACTIVE: '#00AB75',
  INACTIVE: '#F04438',
  PENDING: '#FF8200'
}

export const UserStatusBadge = ({
  userStatus,
  size = 'default'
}: UserStatusBadgeProps) => {
  const t = useTranslations('UserStatuses')

  return (
    <div>
      <Badge
        style={{
          backgroundColor: statusBgColorFaded[userStatus],
          color: statusColorFaded[userStatus],
          height: size === 'default' ? 24 : 20
        }}
      >
        <p className="text-xs font-medium">{t(userStatus)}</p>
      </Badge>
    </div>
  )
}
