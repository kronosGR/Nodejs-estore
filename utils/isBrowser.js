module.exports = (agent) => {
  return (
    agent.includes('Chrome') ||
    agent.includes('Safari') ||
    agent.includes('Firefox') ||
    agent.includes('Edg') ||
    agent.includes('OPR')
  );
};
