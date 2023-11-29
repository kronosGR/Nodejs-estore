module.exports = (agent) => {
  return (
    agent.includes('Chrome') ||
    agent.includes('Safari') ||
    agent.includes('FireFox') ||
    agent.includes('Edg') ||
    agent.includes('OPR')
  );
};
