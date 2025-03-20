import React, { useState, useEffect, useRef } from 'react';
import styles from './Calculator.module.css';
import posterCal from '@assets/images/posterCal.jpeg';
import goldCoin from '@assets/tokens/gold1.jpg';
import s3 from '@assets/images/s3.jpg';

const Calculator = () => {
  const [sneaker, setSneaker] = useState({
    rarity: 'warrior',
    type: 'walker',
    level: 1,
    mana: 2,
    power: 1,
    wings: {
      level: 0,
      bonus: 0
    },
    halo: {
      level: 0,
      bonus: 0
    }
  });

  const [earnings, setEarnings] = useState({
    hsePerMin: 0,
    hsePerSession: 0,
    sessionTime: 0
  });

  const [basePowers, setBasePowers] = useState({
    shoe: 0,
    wings: 0,
    halo: 0
  });

  const [inputValues, setInputValues] = useState({
    shoe: '',
    wings: '',
    halo: ''
  });

  const rarityOrder = ['warrior', 'general', 'knight', 'lord', 'sovereign'];
  const rarityLabels = {
    warrior: 'Warrior',
    general: 'General',
    knight: 'Knight',
    lord: 'Lord',
    sovereign: 'Sovereign'
  };

  const rarityPowerRanges = {
    warrior: { min: 1, max: 10 },    // Common
    general: { min: 8, max: 18 },    // Uncommon
    knight: { min: 15, max: 35 },    // Rare
    lord: { min: 28, max: 63 },      // Epic
    sovereign: { min: 50, max: 112 }  // Legendary
  };

  const enhancementPowerRanges = {
    1: { min: 1, max: 5 },
    2: { min: 6, max: 10 },
    3: { min: 11, max: 15 },
    4: { min: 16, max: 20 },
    5: { min: 21, max: 25 },
    6: { min: 26, max: 30 },
    7: { min: 31, max: 35 },
    8: { min: 36, max: 40 },
    9: { min: 41, max: 45 },
    10: { min: 46, max: 50 }
  };

  const rarityAttributePoints = {
    warrior: 4,    // Warrior gets 4 points per level
    general: 6,    // General gets 6 points per level
    knight: 8,     // Knight gets 8 points per level
    lord: 10,      // Lord gets 10 points per level
    sovereign: 12  // Sovereign gets 12 points per level
  };

  const handleRarityChange = (direction) => {
    const currentIndex = rarityOrder.indexOf(sneaker.rarity);
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
    } else {
      newIndex = currentIndex < rarityOrder.length - 1 ? currentIndex + 1 : currentIndex;
    }
    console.log('newIndex:', newIndex)
    handleSneakerChange('rarity', rarityOrder[newIndex]);
  };

  const rarityMultipliers = {
    warrior: 1.0,
    general: 1.5,
    knight: 2.0,
    lord: 2.5,
    sovereign: 3.0
  };

  const calculateEnhancementBonus = (level) => {
    if (level === 0) return 0;

    // Tính toán bonus dựa trên level
    if (level <= 10) {
      return 0.005 * level; // 0.5% mỗi level, max 5% ở level 10
    } else if (level <= 20) {
      return 0.05 + (0.005 * (level - 10)); // Từ 5% lên 10% từ level 11-20
    } else if (level <= 30) {
      return 0.10 + (0.005 * (level - 20)); // Từ 10% lên 15% từ level 21-30
    } else {
      return 0.15 + (0.005 * (level - 30)); // Từ 15% lên 20% từ level 31-40
    }
  };

  const calculateHSE = () => {
    // Base rate
    const baseRate = 0.35;

    // Quality multiplier
    const qualityMultiplier = rarityMultipliers[sneaker.rarity];

    // Power bonus
    const powerBonus = 1 + (sneaker.power * 0.01);

    // Level multiplier
    const levelMultiplier = 1 + (sneaker.level * 0.02);

    // Enhancement bonus
    const wingsBonus = 1 + calculateEnhancementBonus(sneaker.wings.level);
    const haloBonus = 1 + calculateEnhancementBonus(sneaker.halo.level);
    const enhancementMultiplier = wingsBonus * haloBonus;

    // Calculate HSE per minute
    const hsePerMin = baseRate * qualityMultiplier * powerBonus * levelMultiplier * enhancementMultiplier;

    // Calculate session details
    const sessionTime = sneaker.mana * 10; // 10 minutes per mana
    const hsePerSession = hsePerMin * sessionTime;

    setEarnings({
      hsePerMin: parseFloat(hsePerMin.toFixed(2)),
      hsePerSession: parseFloat(hsePerSession.toFixed(2)),
      sessionTime
    });
  };

  const calculateTotalPower = (type) => {
    if (type === 'shoe') {
      const levelBonus = sneaker.level * rarityAttributePoints[sneaker.rarity];
      return basePowers[type] + levelBonus;
    }
    // Wings và Halo không có power, chỉ có bonus percentage
    return 0;
  };

  useEffect(() => {
    calculateHSE();
  }, [sneaker]);

  useEffect(() => {
    if (sneaker.level < 10) {
      // Reset Wings and Halo values when level < 10
      setBasePowers(prev => ({
        ...prev,
        wings: 0,
        halo: 0
      }));
      setInputValues(prev => ({
        ...prev,
        wings: '',
        halo: ''
      }));
      handleEnhancementChange('wings', 'level', 0);
      handleEnhancementChange('halo', 'level', 0);
    }
  }, [sneaker.level]);

  const calculatePower = (level) => {
    // Giả sử Power tăng theo cấp độ, bạn có thể điều chỉnh logic này theo yêu cầu
    return Math.min(level, 112); // Giới hạn Power tối đa là 112
  };

  const handleSneakerChange = (field, value) => {
    setSneaker(prev => {
      const updatedSneaker = {
        ...prev,
        [field]: field === 'rarity' ? value : Math.min(value, 50)
      };

      // Reset wings and halo levels if sneaker level is set below 10
      if (field === 'level') {
        if (value < 10) {
          // Reset khi level < 10
          updatedSneaker.wings.level = 0;
          updatedSneaker.halo.level = 0;
        } else if (value < prev.level) {
          // Reset khi giảm level và wings/halo level lớn hơn level mới
          if (prev.wings.level > value) {
            updatedSneaker.wings.level = 0;
          }
          if (prev.halo.level > value) {
            updatedSneaker.halo.level = 0;
          }
        }
      }

      // Reset tất cả giá trị Power khi rarity thay đổi
      if (field === 'rarity') {
        // Reset input values
        setInputValues({
          shoe: '',
          wings: '',
          halo: ''
        });

        // Reset base powers
        setBasePowers({
          shoe: 0,
          wings: 0,
          halo: 0
        });

        // Reset wings và halo level
        updatedSneaker.wings.level = 0;
        updatedSneaker.halo.level = 0;
      }

      return updatedSneaker;
    });
  };

  const handleEnhancementChange = (type, field, value) => {
    setSneaker(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        // Ensure enhancement level cannot exceed sneaker level and is within 0-40 range
        [field]: Math.max(0, Math.min(value, Math.min(40, prev.level)))
      }
    }));
  };

  const getQualityBackground = (quality) => {
    return styles[`calc_${quality}Bg`];
  };

  const handlePowerChange = (type, value) => {
    setBasePowers(prev => ({ ...prev, [type]: value }));
  };

  const handleDecrement = (type) => {
    if (type === 'shoe') {
      setInputValues(prev => {
        const currentValue = parseInt(prev[type]) || 1;
        const powerRange = rarityPowerRanges[sneaker.rarity];
        const newValue = Math.max(powerRange.min, currentValue - 1);
        handlePowerChange(type, newValue);
        return {
          ...prev,
          [type]: newValue.toString()
        };
      });
    }
    // Không xử lý decrement cho Wings và Halo vì chúng không có power
  };

  const handleIncrement = (type) => {
    if (type === 'shoe') {
      setInputValues(prev => {
        const currentValue = parseInt(prev[type]) || 1;
        const powerRange = rarityPowerRanges[sneaker.rarity];
        const newValue = Math.min(powerRange.max, currentValue + 1);
        handlePowerChange(type, newValue);
        return {
          ...prev,
          [type]: newValue.toString()
        };
      });
    }
    // Không xử lý increment cho Wings và Halo vì chúng không có power
  };

  // Thêm các hàm xử lý long press
  const useLongPress = (callback, options = {}) => {
    const {
      initialDelay = 140,   // Tăng lên 200ms
      interval = 100,       // Tăng lên 100ms
      speedUpDelay = 500   // Tăng lên 1000ms
    } = options;

    const [isPressed, setIsPressed] = useState(false);
    const timeoutRef = useRef(null);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);
    const isLongPressRef = useRef(false);

    useEffect(() => {
      if (isPressed) {
        startTimeRef.current = Date.now();

        timeoutRef.current = setTimeout(() => {
          isLongPressRef.current = true;
          callback();
        }, initialDelay);
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);

        if (!isLongPressRef.current && startTimeRef.current) {
          callback();
        }

        startTimeRef.current = null;
        isLongPressRef.current = false;
      }

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [isPressed, callback, initialDelay, interval, speedUpDelay]);

    return {
      onMouseDown: () => setIsPressed(true),
      onMouseUp: () => setIsPressed(false),
      onMouseLeave: () => setIsPressed(false),
      onTouchStart: () => setIsPressed(true),
      onTouchEnd: () => setIsPressed(false)
    };
  };

  return (
    <div className={styles.calc_container}>
      <h1 className={styles.calc_title}>HSE Earn Calculator</h1>

      <div className={styles.calc_poster}>
        <img src={posterCal} alt="Health Step Calculator Poster" />
      </div>

      <div className={styles.calc_mainContent}>
        {/* Left side - All inputs */}
        <div className={styles.calc_contentSection}>
          <h2>Sneaker</h2>
          <div className={styles.calc_configGrid}>
            <div className={styles.calc_configCard}>

              <div className={styles.calc_configItem}>
                <div className={styles.calc_configLabel}>CHOOSE RARITY:</div>
                <div className={styles.calc_raritySelector}>
                  <button
                    className={styles.calc_rarityNav}
                    onClick={() => handleRarityChange('prev')}
                  >
                    ‹
                  </button>
                  <div className={`${styles.calc_rarityDisplay} ${styles[`calc_rarity${rarityLabels[sneaker.rarity]}`]}`}>
                    {rarityLabels[sneaker.rarity]}
                  </div>
                  <button
                    className={styles.calc_rarityNav}
                    onClick={() => handleRarityChange('next')}
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className={styles.calc_configItem}>
                <div className={styles.calc_configLabel}>SNEAKERS LEVEL:</div>
                <div className={styles.calc_controls}>
                  <button
                    {...useLongPress(
                      () => handleSneakerChange('level', Math.max(1, sneaker.level - 1))
                    )}
                  >‹</button>
                  <span>{sneaker.level}</span>
                  <button
                    {...useLongPress(
                      () => handleSneakerChange('level', sneaker.level + 1)
                    )}
                  >›</button>
                </div>
              </div>

              <div className={styles.calc_configItem}>
                <div className={styles.calc_configLabel}>DAILY MANA:</div>
                <div className={styles.calc_controls}>
                  <button
                    {...useLongPress(
                      () => handleSneakerChange('mana', Math.max(2, sneaker.mana - 1))
                    )}
                  >‹</button>
                  <span>{sneaker.mana}</span>
                  <button
                    {...useLongPress(
                      () => handleSneakerChange('mana', Math.min(20, sneaker.mana + 1))
                    )}
                  >›</button>
                </div>
              </div>
            </div>


          </div>

          <div className={styles.calc_enhancementsSection}>
            <h2>Wings</h2>
            <div className={styles.calc_configGrid}>
              <div className={styles.calc_configCard} style={{ opacity: sneaker.level < 10 ? 0.5 : 1 }}>
                <div className={styles.calc_configItem}>
                  <div className={styles.calc_configLabel}>WINGS LEVEL:</div>
                  <div className={styles.calc_controls}>
                    <button
                      {...useLongPress(
                        () => handleEnhancementChange('wings', 'level', sneaker.wings.level - 1)
                      )}
                      disabled={sneaker.level < 10}
                    >-</button>
                    <span>{sneaker.wings.level}</span>
                    <button
                      {...useLongPress(
                        () => handleEnhancementChange('wings', 'level', sneaker.wings.level + 1)
                      )}
                      disabled={sneaker.level < 10}
                    >+</button>
                  </div>
                </div>
                <div className={styles.calc_bonusInfo}>
                  <div className={styles.calc_bonusRow}>
                    <p className={styles.calc_bonusText}>Bonus: +{(calculateEnhancementBonus(sneaker.wings.level) * 100).toFixed(2)}%</p>
                    <p className={styles.calc_levelWarning}>
                      {sneaker.level < 10
                        ? "Enable at Sneaker Level 10"
                        : sneaker.wings.level === sneaker.level
                          ? `Max level reached (Sneaker level: ${sneaker.level})`
                          : `Max level: ${sneaker.level}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.calc_enhancementsSection}>
            <h2>Halo</h2>
            <div className={styles.calc_configGrid}>
              <div className={styles.calc_configCard} style={{ opacity: sneaker.level < 10 ? 0.5 : 1 }}>
                <div className={styles.calc_configItem}>
                  <div className={styles.calc_configLabel}>HALO LEVEL:</div>
                  <div className={styles.calc_controls}>
                    <button
                      {...useLongPress(
                        () => handleEnhancementChange('halo', 'level', sneaker.halo.level - 1)
                      )}
                      disabled={sneaker.level < 10}
                    >-</button>
                    <span>{sneaker.halo.level}</span>
                    <button
                      {...useLongPress(
                        () => handleEnhancementChange('halo', 'level', sneaker.halo.level + 1)
                      )}
                      disabled={sneaker.level < 10}
                    >+</button>
                  </div>
                </div>
                <div className={styles.calc_bonusInfo}>
                  <div className={styles.calc_bonusRow}>
                    <p className={styles.calc_bonusText}>Bonus: +{(calculateEnhancementBonus(sneaker.halo.level) * 100).toFixed(2)}%</p>
                    <p className={styles.calc_levelWarning}>
                      {sneaker.level < 10
                        ? "Enable at Sneaker Level 10"
                        : sneaker.halo.level === sneaker.level
                          ? `Max level reached (Sneaker level: ${sneaker.level})`
                          : `Max level: ${sneaker.level}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.calc_contentSection}>
            <h2>Power</h2>
            <div className={styles.calc_powerSection}>
              <div className={styles.calc_powerHeader}>
                <div></div>
                <div className={styles.calc_powerBaseColumn}>
                  <span className={styles.calc_powerColumnTitle}>BASE</span>
                </div>
                <div className={styles.calc_powerTotalColumn}>
                  <span className={styles.calc_powerColumnTitle}>TOTAL</span>
                </div>
              </div>

              <div className={styles.calc_powerItem}>
                <div className={styles.calc_powerLabel}>SHOE:</div>
                <div className={styles.calc_powerControls}>
                  <input
                    type="number"
                    className={styles.calc_powerInput}
                    placeholder={`${rarityPowerRanges[sneaker.rarity].min}-${rarityPowerRanges[sneaker.rarity].max}`}
                    value={inputValues.shoe || ''}
                    min={rarityPowerRanges[sneaker.rarity].min}
                    max={rarityPowerRanges[sneaker.rarity].max}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      const powerRange = rarityPowerRanges[sneaker.rarity];
                      if (!isNaN(value)) {
                        const validValue = Math.min(Math.max(value, powerRange.min), powerRange.max);
                        setInputValues(prev => ({ ...prev, shoe: validValue.toString() }));
                        handlePowerChange('shoe', validValue);
                        setSneaker(prev => ({ ...prev, power: validValue }));
                      } else {
                        setInputValues(prev => ({ ...prev, shoe: '' }));
                        handlePowerChange('shoe', powerRange.min);
                        setSneaker(prev => ({ ...prev, power: powerRange.min }));
                      }
                    }}
                  />
                </div>
                <div className={styles.calc_powerTotal}>
                  <span>{calculateTotalPower('shoe')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sneaker and Results */}
        <div className={styles.calc_sneakerSection}>
          <div className={styles.calc_sneakerDisplay}>
            <div className={`${styles.calc_sneakerBg} ${getQualityBackground(sneaker.rarity)}`}>
              {sneaker.halo.level > 0 && (
                <svg viewBox="0 0 100 100" className={styles.calc_flameAnimation}>
                  <defs>
                    <radialGradient id="haloGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFF" stopOpacity="1" />
                      <stop offset="30%" stopColor="#FFD700" stopOpacity="0.9" />
                      <stop offset="60%" stopColor="#FFD700" stopOpacity="0.7" />
                      <stop offset="85%" stopColor="#FFD700" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="50" cy="50" r="49" fill="url(#haloGradient)" />
                </svg>
              )}
            </div>
          </div>

          <div className={styles.calc_resultsCard}>
            <h2>Earnings</h2>
            <div className={styles.calc_resultsContent}>
              <p className={styles.calc_halvingInfo}>
                Halving count: <span className={styles.calc_halvingCount}>0</span> <span className={styles.calc_halvingRate}>(Rate: 100%)</span>
              </p>
              <p>
                HSE per minute: <span>{earnings.hsePerMin.toFixed(2)}</span>
              </p>
              <p>
                Running time: <span>{sneaker.mana * 5} minutes</span>
              </p>
              <p className={styles.calc_dailyIncome}>
                DAILY INCOME: <span>{(earnings.hsePerMin * sneaker.mana * 5).toFixed(2)} <img src={goldCoin} alt="HSE" className={styles.calc_coinIcon} /></span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.calc_formula}>
        <h3>Earning Formula:</h3>
        <code>
          HSE/min = 0.35 × Quality × (1 + Power×0.01) × (1 + Level×0.02) × [(1 + Wings) × (1 + Halo)] × HalvingRate
        </code>
      </div>

      <div className={styles.calc_footer}>
        <img src={s3} alt="Footer" />
        <div className={styles.calc_footerOverlay}></div>
      </div>
    </div>
  );
};

export default Calculator; 