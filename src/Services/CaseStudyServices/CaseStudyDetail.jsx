export const CaseStudyDetail = async (id) => {
  try {
    const response = await fetch(`/api/casestudy/${Number(id)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching case study detail:', error);
    return {
      status: 500,
      data: [],
    };
  }
};
