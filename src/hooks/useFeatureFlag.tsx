import { useFeatureFlag as useFeatureFlagPosthog } from 'posthog-react-native'

export const useFeatureFlag = ( flag: string ) => {
    const featureFlag = useFeatureFlagPosthog(flag)
    return featureFlag
}

