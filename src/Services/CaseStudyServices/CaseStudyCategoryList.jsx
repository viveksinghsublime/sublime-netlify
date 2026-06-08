export const CaseStudyCategoryList = async () => {
 // const token = localStorage.getItem("token") || null;

 // const queryString = new URLSearchParams(payload).toString();

  try {
    const response = await fetch(`/api/casestudycategory/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      //  "x-access-token": token || "",
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
