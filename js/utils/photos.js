export function formatImages(photos, width) {
  return photos.reduce(function(result, value, index, array) {
    if (index % 2 === 0)
      result.push(array.slice(index, index + 2));
    return result;
  }, []).map((p) => {
    if(p[0] != null && p[1] != null) {
      const totalAR = p[0].aspectRatio + p[1].aspectRatio;
      const widthOne = (p[0].aspectRatio / totalAR) * width;
      const widthTwo = (p[1].aspectRatio / totalAR) * width;
      return [{...p[0], width: widthOne, height: (widthOne / p[0].aspectRatio)},
              {...p[1], width: widthTwo, height: (widthTwo / p[1].aspectRatio)}];
    } else {
      return [{...p[0], width: (width / 2), height: ((width / 2) / p[0].aspectRatio)}];
    }
  });
}
