import datasourceLogic from './datasourceLogic';
import appLogic from './appLogic';
import jobLogic from './jobLogic';
import etlLogic from './etlLogic';
import logLogic from './LogLogic';
import mapperLogic from './mapperLogic';
import emailLogic from './emailLogic';

// combine all logices
const logices = [...datasourceLogic, ...appLogic, ...jobLogic, ...etlLogic, ...logLogic, ...mapperLogic, ...emailLogic];

export default logices;
