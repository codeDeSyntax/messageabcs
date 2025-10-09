import { useAppContext } from "@/hooks/useAppContext";

export function TopicActionButtons() {
  const { selectedTopic, setSelectedTopic, isActionMenuOpen } = useAppContext();

  // No action buttons shown - topics are view-only on main screen
  return null;
}
