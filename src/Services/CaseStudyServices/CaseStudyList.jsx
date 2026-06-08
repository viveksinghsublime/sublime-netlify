export const CaseStudyList = async () => {

  try {
    const response = await fetch(`/api/casestudy/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product list:", error);
    return {
      success: false,
      message: "Something went wrong while fetching category list.",
      data: [],
    };
  }
};
