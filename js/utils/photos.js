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
      return [{...p[0], displayWidth: widthOne, displayHeight: (widthOne / p[0].aspectRatio)},
              {...p[1], displayWidth: widthTwo, displayHeight: (widthTwo / p[1].aspectRatio)}];
    } else {
      return [{...p[0], displayWidth: (width / 2), displayHeight: ((width / 2) / p[0].aspectRatio)}];
    }
  });
}
