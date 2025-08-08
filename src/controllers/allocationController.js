const { calculateAllocation } = require('../services/allocationService');


exports.postAllocation = (req, res) => {
  try {
    const { siteKitty, salesAgents } = req.body;
    const allocations = calculateAllocation(siteKitty, salesAgents);

    const totalAllocatedValue = allocations.allocations.reduce((sum, a) => sum + a.assignedDiscount, 0);
    let remainingKittyValue = siteKitty - totalAllocatedValue;

    if (Math.abs(remainingKittyValue) < 0.01) {
      remainingKittyValue = 0;
    }

    const summary = {
      totalAllocated: totalAllocatedValue.toFixed(2),
      remainingKitty: remainingKittyValue.toFixed(2),
      totalAgents: salesAgents.length,
      averageAllocation: (siteKitty / salesAgents.length).toFixed(2)
    };
    
    res.status(200).json({
      allocations: allocations.allocations,
      summary: summary
    });
  } catch (error) {
    console.error('Allocation Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
