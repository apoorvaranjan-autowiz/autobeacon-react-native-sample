import 'react-native-gifted-charts'

declare module 'react-native-gifted-charts' {
    export type CurveType = string
    export interface LineChartPropsType {
        showValuesAbovePoints?: boolean
    }
}