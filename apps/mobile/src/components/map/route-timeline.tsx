import { Text, View } from 'react-native';

interface Stop {
  id: string;
  orderIndex: number;
  label: string;
  arrivesAt?: string | null;
  priceFromOrigin?: string | null;
}

interface RouteTimelineProps {
  stops: Stop[];
  departureAt: string;
  estimatedArrivalAt?: string | null;
  className?: string;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

type StopType = 'origin' | 'intermediate' | 'destination';

function getStopType(index: number, total: number): StopType {
  if (index === 0) return 'origin';
  if (index === total - 1) return 'destination';
  return 'intermediate';
}

function StopCircle({ type }: { type: StopType }) {
  if (type === 'origin') {
    return (
      <View className="w-4 h-4 rounded-full border-2 border-primary-600 bg-white" />
    );
  }
  if (type === 'destination') {
    return (
      <View className="w-4 h-4 rounded-full bg-primary-600" />
    );
  }
  return (
    <View className="w-2.5 h-2.5 rounded-full bg-gray-400" />
  );
}

export default function RouteTimeline({
  stops,
  departureAt,
  estimatedArrivalAt,
  className = '',
}: RouteTimelineProps) {
  const sortedStops = [...stops].sort((a, b) => a.orderIndex - b.orderIndex);
  const total = sortedStops.length;

  const getTimeForStop = (stop: Stop, index: number): string | null => {
    if (index === 0) return formatTime(departureAt);
    if (index === total - 1 && estimatedArrivalAt) return formatTime(estimatedArrivalAt);
    if (stop.arrivesAt) return formatTime(stop.arrivesAt);
    return null;
  };

  return (
    <View className={`px-4 ${className}`}>
      {sortedStops.map((stop, index) => {
        const stopType = getStopType(index, total);
        const time = getTimeForStop(stop, index);
        const isEndpoint = stopType === 'origin' || stopType === 'destination';
        const price = stop.priceFromOrigin ? parseFloat(stop.priceFromOrigin) : 0;
        const isLast = index === total - 1;

        return (
          <View key={stop.id} className="flex-row">
            {/* Left column: circle + dashed connector */}
            <View className="items-center" style={{ width: 24 }}>
              <View
                className="items-center justify-center"
                style={{ height: 24, width: 24 }}
              >
                <StopCircle type={stopType} />
              </View>
              {!isLast && (
                <View
                  style={{
                    flex: 1,
                    width: 1,
                    minHeight: 24,
                    borderLeftWidth: 1.5,
                    borderLeftColor: '#D1D5DB',
                    borderStyle: 'dashed',
                    marginVertical: 2,
                  }}
                />
              )}
            </View>

            {/* Right column: time + label + price */}
            <View className="flex-1 flex-row items-start ml-3 pb-4">
              {/* Time */}
              <View style={{ width: 44 }}>
                {time && (
                  <Text
                    className={`text-sm ${isEndpoint ? 'font-bold text-gray-900' : 'font-normal text-gray-500'}`}
                  >
                    {time}
                  </Text>
                )}
              </View>

              {/* Label */}
              <Text
                className={`flex-1 text-sm ${isEndpoint ? 'font-semibold text-gray-900' : 'text-gray-600'}`}
                numberOfLines={2}
              >
                {stop.label}
              </Text>

              {/* Price offset */}
              {price > 0 && index > 0 && (
                <Text className="text-sm font-semibold text-primary-600 ml-2">
                  +{price.toFixed(0)} MAD
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
