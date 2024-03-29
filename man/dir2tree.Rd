% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/dir2tree.R
\name{dir2tree}
\alias{dir2tree}
\title{Tree representation of a directory}
\usage{
dir2tree(dir, depth = NULL, vertical = FALSE)
}
\arguments{
\item{dir}{the path of the directory}

\item{depth}{a nonnegative integer, the desired depth, or \code{NULL} 
(default) to search until the end}

\item{vertical}{logical, whether to get a vertical tree}
}
\value{
A string.
}
\description{
Returns the hierarchical structure of a folder as a tree.
}
\examples{
cat(dir2tree(".", 1))
cat(dir2tree(".", 2))
cat(dir2tree(".", 2, vertical=TRUE))
}
