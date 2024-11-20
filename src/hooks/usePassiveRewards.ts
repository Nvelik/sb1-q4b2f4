import { useEffect, useRef } from 'react';
import { useUserStore } from '../store/userStore';

const REWARD_INTERVAL = 60000; // 1 minute

export function usePassiveRewards() {
  const { user, addReward, updateLastRewardTime, updateStreak } = useUserStore();
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    // Update streak on component mount
    updateStreak();

    const checkAndReward = () => {
      const now = Date.now();
      const timeDiff = now - user.lastRewardTime;
      
      if (timeDiff >= REWARD_INTERVAL) {
        const rewardMultiple = Math.floor(timeDiff / REWARD_INTERVAL);
        const reward = user.rewardRate * rewardMultiple;
        
        if (reward > 0) {
          addReward(reward, 'time');
          updateLastRewardTime();
        }
      }

      // Update playtime
      const minutesSinceLastUpdate = Math.floor((now - lastUpdateRef.current) / 60000);
      if (minutesSinceLastUpdate > 0) {
        useUserStore.getState().updatePlayTime(minutesSinceLastUpdate);
        lastUpdateRef.current = now;
      }
    };

    const intervalId = setInterval(checkAndReward, REWARD_INTERVAL);
    
    // Initial check
    checkAndReward();
    
    return () => clearInterval(intervalId);
  }, [user.lastRewardTime, user.rewardRate, addReward, updateLastRewardTime, updateStreak]);
}