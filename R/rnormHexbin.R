#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
rnormHexbin <- function(params, width = NULL, height = NULL, elementId = NULL) {
  
  c <- matrix(c(params$var1, params$covar, params$covar, params$var2), ncol = 2)
  q <- t(chol(c))
  
  z1 <- rnorm(params$num, 0, 1)
  z2 <- rnorm(params$num, 0, 1)
  
  z <- rbind(z1, z2)
  
  y <- t(q %*% z)
  
  # forward options using x
  x = list(
    data = y,
    color = params$color
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'rnormHexbin',
    x,
    width = width,
    height = height,
    package = 'tbilinomics.htmlwidgets',
    elementId = elementId
  )
}

#' Shiny bindings for rnormHexbin
#'
#' Output and render functions for using rnormHexbin within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a rnormHexbin
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name rnormHexbin-shiny
#'
#' @export
rnormHexbinOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'rnormHexbin', width, height, package = 'tbilinomics.htmlwidgets')
}

#' @rdname rnormHexbin-shiny
#' @export
renderRnormHexbin <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, rnormHexbinOutput, env, quoted = TRUE)
}
