import { motion } from 'framer-motion';
import { PieChart } from 'react-minimal-pie-chart';
import './Tokenomics.css';
import bg from '@assets/images/ma7.jpg';
import chart from '@assets/images/distributions.png';
import chartDetail from '@assets/images/TokenDistributionStructure.png';

export default function Tokenomics() {
  const tokenData = [
    { title: 'Sale', value: 40, color: '#8B5CF6' },
    { title: 'Ecosystem/Treasury', value: 30, color: '#818CF8' },
    { title: 'Team', value: 15, color: '#F472B6' },
    { title: 'Market Launchpad', value: 12, color: '#34D399' },
    { title: 'Advisors', value: 3, color: '#FCD34D' }
  ];

  return (
    <section className="main-section tokenomics-section">
      <div className="background-image blur-img1">
        <img src={bg} alt="background" />
        <div className="blur-overlay1" />
      </div>
      <h2 className="tokenomics-title">HST Distribution</h2>
      <motion.div
        className="tokenomics-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >

        <div className="tokenomics-container">
          <div className="chart-left">
            <div className="chart-container-left">
              <img src={chart} alt="background" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
            </div>
          </div>
          <div className="chart-right">
            <div className="chart-container-right">
              <img src={chartDetail} alt="background" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}