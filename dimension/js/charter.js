function createChart(dimensionName) {
  svg.selectAll("*").remove();

  if (width > 800) height = 0.7 * window.innerHeight;
  else height = window.innerHeight;

  svg
    .selectAll("legendCircle")
    .data(["Workers", "Entrepreneurs", "Students"])
    .enter()
    .append("circle")
    .attr("class", "legendCircle")
    .attr("r", lollipopRadius)
    .attr("cx", function (d, i) {
      if (width > 800) return 190 * i + 100;
      else return 190 * i + 10;
    })
    .attr("cy", function (d) {
      return 5;
    })
    .attr("fill", function (d) {
      return dimColor(d);
    });

  svg
    .selectAll("legendText")
    .data(["Highly Educated Workers", "Entrepreneurs", "University Students"])
    .enter()
    .append("text")
    .attr("class", "legendText")
    .attr("dy", function (d) {
      return 10;
    })
    .attr("dx", function (d, i) {
      if (width > 800) return 190 * i + 100 + lollipopRadius + 5;
      else return 190 * i + 10 + lollipopRadius + 5;
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "start")
    .attr("fill", lollipopText);

  if (width > 800) {
    svg.attr("width", width).attr("height", height);

    xScale = d3
      .scaleBand()
      .domain(
        data
          .map(function (d) {
            return d.Countries;
          })
          .sort(function (a, b) {
            return parseFloat(a.Countries) - parseFloat(b.Countries);
          })
      )
      .range([margin, width - margin / 2])
      .padding(padding);

    yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - margin, margin / 3]);

    //Create Y axis
    svg
      .append("g")
      .attr("class", "axis y yAxis")
      .attr("transform", "translate(" + margin + ",0)")
      .call(d3.axisLeft(yScale));

    lollipopsLine = svg
      .selectAll("circleLine")
      .data(
        data.filter(function (d) {
          return d.Dimension == dimensionName;
        })
      )
      .enter()
      .append("line")
      .attr("class", "lollipopLine")
      .attr("x1", function (d) {
        if (!(d.value === undefined))
          return xScale(d.Countries) + xScale.bandwidth() / 2;
      })
      .attr("x2", function (d) {
        if (!(d.value === undefined))
          return xScale(d.Countries) + xScale.bandwidth() / 2;
      })
      .attr("y1", function (d) {
        if (!(d.value === undefined)) return yScale(0);
      })
      .attr("y2", function (d) {
        if (!(d.value === undefined)) return yScale(d.value);
      })
      .attr("stroke", lollipopColor)
      .attr("stroke-width", "1");

    ///Lollipop dimDesc
    lollipopsCircle = svg
      .selectAll("lollipopCircle")
      .data(
        data.filter(function (d) {
          return d.Dimension == dimensionName;
        })
      )
      .enter()
      .append("circle")
      .attr("class", "lollipopCircle")
      .attr("r", lollipopRadius)
      .attr("cx", function (d) {
        if (!(d.value === undefined))
          return xScale(d.Countries) + xScale.bandwidth() / 2;
      })
      .attr("cy", function (d) {
        if (!(d.value === undefined)) return yScale(d.value);
      })
      .attr("fill", function (d) {
        if (!(d.value === undefined)) return dimColor(d.Cat);
      });

    lollipopsText = svg
      .selectAll("lollipopText")
      .data(
        data.filter(function (d) {
          return d.Dimension == dimensionName && d.Cat == "Entrepreneurs";
        })
      )
      .enter()
      .append("text")
      .attr("class", "lollipopText")

      .attr("transform", "translate(-7,15)rotate(-90)")
      .attr("dy", function (d) {
        return xScale(d.Countries) + xScale.bandwidth() / 2;
      })
      .attr("dx", function (d) {
        //return -yScale(d.value)
        return -yScale(0);
      })
      .text(function (d) {
        return d.Countries;
      })
      .attr("text-anchor", "start")
      .attr("fill", lollipopText);

    svg
      .selectAll("circle")
      .on("mouseover", function (d) {
        tooltip.html(
          d.Countries +
            "<br> <i> " +
            d.Cat +
            ": " +
            d3.format(".2f")(d.value) +
            "</i>"
        );
        tooltip.style("visibility", "visible");
      })
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);
  } else {
    width = 0.8 * width;
    //var height = window.innerHeight;

    svg.attr("width", width).attr("height", height);

    yScale = d3
      .scaleBand()
      .domain(
        data
          .map(function (d) {
            return d.Countries;
          })
          .sort(function (a, b) {
            return parseFloat(a.Countries) - parseFloat(b.Countries);
          })
      )
      .range([margin, height - margin / 2])
      .padding(padding);

    xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([2 * margin, width - margin / 3]);

    //Create Y axis
    svg
      .append("g")
      .attr("class", "axis x yAxis")
      .attr("transform", "translate(" + 0 + "," + margin + ")")
      .call(d3.axisTop(xScale));

    lollipopsLine = svg
      .selectAll("circleLine")
      .data(
        data.filter(function (d) {
          return d.Dimension == dimensionName;
        })
      )
      .enter()
      .append("line")
      .attr("class", "lollipopLine")
      .attr("x1", function (d) {
        if (!(d.value === undefined)) return xScale(0);
      })
      .attr("x2", function (d) {
        if (!(d.value === undefined)) return xScale(d.value);
      })
      .attr("y1", function (d) {
        if (!(d.value === undefined))
          return yScale(d.Countries) + yScale.bandwidth() / 2;
      })
      .attr("y2", function (d) {
        if (!(d.value === undefined))
          return yScale(d.Countries) + yScale.bandwidth() / 2;
      })
      .attr("stroke", lollipopColor)
      .attr("stroke-width", "1");

    lollipopsText = svg
      .selectAll("lollipopText")
      .data(
        data.filter(function (d) {
          return d.Dimension == dimensionName;
        })
      )
      .enter()
      .append("text")
      .attr("class", "lollipopText")

      .attr("transform", "translate(" + -lollipopRadius + ",-2)rotate(0)")
      .attr("dx", function (d) {
        //return xScale(d.value)

        return xScale(0);
      })
      .attr("dy", function (d) {
        return yScale(d.Countries) + yScale.bandwidth() / 2;
      })
      .text(function (d) {
        return d.Countries;
      })
      .attr("text-anchor", "beginning")
      .attr("fill", lollipopText);

    ///Lollipop dimDesc
    lollipopsCircle = svg
      .selectAll("lollipopCircle")
      .data(
        data.filter(function (d) {
          return d.Dimension == dimensionName;
        })
      )
      .enter()
      .append("circle")
      .attr("class", "lollipopCircle")
      .attr("r", lollipopRadius)
      .attr("cx", function (d) {
        if (!(d.value === undefined)) return xScale(d.value);
      })
      .attr("cy", function (d) {
        if (!(d.value === undefined))
          return yScale(d.Countries) + yScale.bandwidth() / 2;
      })
      .attr("fill", function (d) {
        if (!(d.value === undefined)) return dimColor(d.Cat);
      });

    svg
      .selectAll("circle")
      .on("mouseover", function (d) {
        tooltip.html(
          d.Countries +
            "<br> <i> " +
            d.Cat +
            ": " +
            d3.format(".2f")(d.value) +
            "</i>"
        );
        tooltip.style("visibility", "visible");
      })
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);
  }
}

function update(dimensionName) {
  if (document.getElementById("WorkersButton").checked) {
    document.getElementById("WorkersButton").checked = false;
  } else if (document.getElementById("EntrepreneursButton").checked) {
    document.getElementById("EntrepreneursButton").checked = false;
  } else if (document.getElementById("StudentButton").checked) {
    document.getElementById("StudentButton").checked = false;
  } else if (document.getElementById("Start-up-foundersButton").checked) {
    document.getElementById("Start-up-foundersButton").checked = false;
  }

  if (dimensionName == "Income")
    document.getElementById("titleDesc").innerHTML = "Income and tax";
  else
    document.getElementById("titleDesc").innerHTML = dimensionName.replace(
      /_/g,
      " "
    );

  selDimPlaceholder = dimensionName;

  if (width > 800) {
    xScale = d3
      .scaleBand()
      .domain(
        data
          .filter(function (d) {
            return d.Dimension == selDimPlaceholder;
          })
          .sort(function (a, b) {
            return parseFloat(a.Countries) - parseFloat(b.Countries);
          })
          .map(function (d) {
            return d.Countries;
          })
      )
      .range([margin, width - margin / 2])
      .padding(padding);

    lollipopsCircle
      .data(
        data.filter(function (d) {
          return d.Dimension == dimensionName;
        })
      )
      // .enter()
      .transition()
      .duration(1000)
      .ease(d3.easeBounce)
      .attr("cx", function (d) {
        if (!(d.value === undefined))
          return xScale(d.Countries) + xScale.bandwidth() / 2;
      })
      .attr("cy", function (d) {
        if (!(d.value === undefined)) return yScale(d.value);
      });

    lollipopsText
      .data(
        data.filter(function (d) {
          return d.Dimension == dimensionName;
        })
      )
      .transition()
      .duration(1000)
      .ease(d3.easeBounce)
      .attr("dy", function (d) {
        return xScale(d.Countries) + xScale.bandwidth() / 2;
      })
      .attr("dx", function (d) {
        //return -yScale(d.value)
        return -yScale(0);
      });

    lollipopsLine
      .data(
        data.filter(function (d) {
          return d.Dimension == dimensionName;
        })
      )
      .transition()
      .duration(1000)
      .ease(d3.easeBounce)
      .attr("x1", function (d) {
        if (!(d.value === undefined))
          return xScale(d.Countries) + xScale.bandwidth() / 2;
      })
      .attr("y1", function (d) {
        if (!(d.value === undefined)) return yScale(0);
      })
      .attr("x2", function (d) {
        if (!(d.value === undefined))
          return xScale(d.Countries) + xScale.bandwidth() / 2;
      })
      .attr("y2", function (d) {
        if (!(d.value === undefined)) return yScale(d.value);
      });
  } else {
    yScale = d3
      .scaleBand()
      .domain(
        data
          .filter(function (d) {
            return d.Dimension == selDimPlaceholder;
          })
          .sort(function (a, b) {
            return parseFloat(a.Countries) - parseFloat(b.Countries);
          })
          .map(function (d) {
            return d.Countries;
          })
      )
      .range([margin, height - margin / 2])
      .padding(padding);

    lollipopsCircle
      .data(
        data.filter(function (d) {
          return d.Dimension == dimensionName;
        })
      )
      // .enter()
      .transition()
      .duration(1500)
      .ease(d3.easeBounce)
      .attr("cx", function (d) {
        if (!(d.value === undefined)) return xScale(d.value);
      })
      .attr("cy", function (d) {
        if (!(d.value === undefined))
          return yScale(d.Countries) + yScale.bandwidth() / 2;
      });

    lollipopsText
      .data(
        data.filter(function (d) {
          return d.Dimension == dimensionName;
        })
      )
      .transition()
      .duration(1500)
      .ease(d3.easeBounce)
      .attr("transform", "translate(" + -lollipopRadius + ",-2)rotate(0)")
      .attr("dx", function (d) {
        return xScale(0);
      })
      .attr("dy", function (d) {
        return yScale(d.Countries) + yScale.bandwidth() / 2;
      });

    lollipopsLine
      .data(
        data.filter(function (d) {
          return d.Dimension == dimensionName;
        })
      )
      .transition()
      .duration(1500)
      .ease(d3.easeBounce)
      .attr("x1", function (d) {
        if (!(d.value === undefined)) return xScale(0);
      })
      .attr("x2", function (d) {
        if (!(d.value === undefined)) return xScale(d.value);
        else return xScale(0);
      })
      .attr("y1", function (d) {
        if (!(d.value === undefined))
          return yScale(d.Countries) + yScale.bandwidth() / 2;
      })
      .attr("y2", function (d) {
        if (!(d.value === undefined))
          return yScale(d.Countries) + yScale.bandwidth() / 2;
      });
  }
}

function sortupdate(topicSelected) {
  var sortFilter;

  if (document.getElementById("WorkersButton").checked) {
    sortFilter = document.getElementById("WorkersButton").value;
  } else if (document.getElementById("EntrepreneursButton").checked) {
    sortFilter = document.getElementById("EntrepreneursButton").value;
  } else if (document.getElementById("StudentButton").checked) {
    sortFilter = document.getElementById("StudentButton").value;
  } else if (document.getElementById("Start-up-foundersButton").checked) {
    sortFilter = document.getElementById("Start-up-foundersButton").value;
  }

  if (width > 800) {
    xScale = d3
      .scaleBand()
      .domain(
        data
          .filter(function (d) {
            return d.Cat == sortFilter && d.Dimension == selDimPlaceholder;
          })
          .sort(function (a, b) {
            return parseFloat(b.value) - parseFloat(a.value);
          })
          .map(function (d) {
            return d.Countries;
          })
      )
      .range([margin, width - margin / 2])
      .padding(padding);

    lollipopsCircle
      .data(
        data.filter(function (d) {
          return d.Dimension == selDimPlaceholder;
        })
      )
      // .enter()
      .transition()
      .duration(1000)
      .ease(d3.easeBounce)
      .attr("cx", function (d) {
        if (!(d.value === undefined))
          return xScale(d.Countries) + xScale.bandwidth() / 2;
      })
      .attr("cy", function (d) {
        if (!(d.value === undefined)) return yScale(d.value);
      });

    lollipopsText
      .data(
        data.filter(function (d) {
          return d.Dimension == selDimPlaceholder;
        })
      )
      .transition()
      .duration(1000)
      .ease(d3.easeBounce)
      .attr("dy", function (d) {
        return xScale(d.Countries) + xScale.bandwidth() / 2;
      })
      .attr("dx", function (d) {
        //return -yScale(d.value)
        return -yScale(0);
      });

    lollipopsLine
      .data(
        data.filter(function (d) {
          return d.Dimension == selDimPlaceholder;
        })
      )
      .transition()
      .duration(1000)
      .ease(d3.easeBounce)
      .attr("x1", function (d) {
        if (!(d.value === undefined))
          return xScale(d.Countries) + xScale.bandwidth() / 2;
      })
      .attr("y1", function (d) {
        if (!(d.value === undefined)) return yScale(0);
      })
      .attr("x2", function (d) {
        if (!(d.value === undefined))
          return xScale(d.Countries) + xScale.bandwidth() / 2;
      })
      .attr("y2", function (d) {
        if (!(d.value === undefined)) return yScale(d.value);
        else return yScale(0);
      });
  } else {
    yScale = d3
      .scaleBand()
      .domain(
        data
          .filter(function (d) {
            return d.Cat == sortFilter && d.Dimension == selDimPlaceholder;
          })
          .sort(function (a, b) {
            return parseFloat(b.value) - parseFloat(a.value);
          })
          .map(function (d) {
            return d.Countries;
          })
      )
      .range([margin, height - margin / 2])
      .padding(padding);

    lollipopsCircle
      .data(
        data.filter(function (d) {
          return d.Dimension == selDimPlaceholder;
        })
      )
      // .enter()
      .transition()
      .duration(1500)
      .ease(d3.easeBounce)
      .attr("cx", function (d) {
        if (!(d.value === undefined)) return xScale(d.value);
      })
      .attr("cy", function (d) {
        if (!(d.value === undefined))
          return yScale(d.Countries) + yScale.bandwidth() / 2;
      });

    lollipopsText
      .data(
        data.filter(function (d) {
          return d.Dimension == selDimPlaceholder;
        })
      )
      .transition()
      .duration(1500)
      .ease(d3.easeBounce)
      .attr("transform", "translate(" + -lollipopRadius + ",-2)rotate(0)")
      .attr("dx", function (d) {
        return xScale(0);
      })
      .attr("dy", function (d) {
        return yScale(d.Countries) + yScale.bandwidth() / 2;
      });

    lollipopsLine
      .data(
        data.filter(function (d) {
          return d.Dimension == selDimPlaceholder;
        })
      )
      .transition()
      .duration(1500)
      .ease(d3.easeBounce)
      .attr("x1", function (d) {
        if (!(d.value === undefined)) return xScale(0);
      })
      .attr("x2", function (d) {
        if (!(d.value === undefined)) return xScale(d.value);
        else return xScale(0);
      })
      .attr("y1", function (d) {
        if (!(d.value === undefined))
          return yScale(d.Countries) + yScale.bandwidth() / 2;
      })
      .attr("y2", function (d) {
        if (!(d.value === undefined))
          return yScale(d.Countries) + yScale.bandwidth() / 2;
      });
  }
}
