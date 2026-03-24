import { Pressable, Text, View } from 'react-native';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 18,
  interactive = false,
  onRate,
  showValue = false,
  className = '',
}: StarRatingProps) {
  return (
    <View className={`flex-row items-center ${className}`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starIndex = i + 1;
        const isFilled = starIndex <= Math.round(rating);

        const star = (
          <Text
            key={i}
            style={{ fontSize: size }}
            className={isFilled ? 'text-warning-500' : 'text-gray-300'}
          >
            ★
          </Text>
        );

        if (interactive && onRate) {
          return (
            <Pressable key={i} onPress={() => onRate(starIndex)} className="px-0.5">
              {star}
            </Pressable>
          );
        }

        return star;
      })}
      {showValue && (
        <Text className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</Text>
      )}
    </View>
  );
}
