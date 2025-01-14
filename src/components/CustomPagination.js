// import React, { useEffect, useState } from 'react';
// import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

// const CustomPagination = ({ totalStocks, itemsPerPage, onPageChange }) => {
//     const totalPages = Math.ceil(totalStocks / itemsPerPage);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [isSmallScreen, setIsSmallScreen] = useState(true);
//     const [pageNumbers, setPageNumbers] = useState([]);

//     useEffect(() => {
//         const handleResize = () => {
//             setIsSmallScreen(window.innerWidth <= 800);
//         };

//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     useEffect(() => {
//         console.log(isSmallScreen, " ========== is small screen");

//         console.log(window.innerWidth <= 800, " ==== window.innerWidth", window.innerWidth);

//         const maxPageItemsToShow = window.innerWidth <= 800 ? 2 : 5;
//         const maxPageItemsWithEllipsis = window.innerWidth <= 800 ? 1 : 3;
//         setPageNumbers(generatePageNumbers(maxPageItemsToShow, maxPageItemsWithEllipsis));

//     }, [currentPage, isSmallScreen, totalPages]);

//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//         onPageChange(page);
//     };

//     const generatePageNumbers = (maxPageItemsToShow, maxPageItemsWithEllipsis) => {
//         const pageNumbers = [];

//         if (totalPages <= maxPageItemsToShow) {
//             for (let i = 1; i <= totalPages; i++) {
//                 pageNumbers.push(i);
//             }
//         } else {
//             let startPage = Math.max(1, currentPage - maxPageItemsWithEllipsis);
//             let endPage = Math.min(totalPages, currentPage + maxPageItemsWithEllipsis);

//             if (currentPage <= maxPageItemsWithEllipsis) {
//                 endPage = maxPageItemsToShow;
//             } else if (currentPage >= totalPages - maxPageItemsWithEllipsis) {
//                 startPage = totalPages - maxPageItemsToShow + 1;
//             }

//             for (let i = startPage; i <= endPage; i++) {
//                 pageNumbers.push(i);
//             }

//             if (startPage > 1) {
//                 pageNumbers.unshift('...');
//             }
//             if (endPage < totalPages) {
//                 pageNumbers.push('...');
//             }
//         }

//         return pageNumbers;
//     };

//     return (
//         <Pagination aria-label="Page navigation" size="md">
//             <PaginationItem disabled={currentPage === 1} className={`${isSmallScreen ? "d-none" : ""}`}>
//                 <PaginationLink first onClick={() => handlePageChange(1)} />
//             </PaginationItem>

//             <PaginationItem disabled={currentPage === 1}>
//                 <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
//             </PaginationItem>

//             {pageNumbers.map((page, index) => (
//                 <PaginationItem key={index} active={currentPage === page}>
//                     <PaginationLink onClick={() => page !== '...' && handlePageChange(page)}>
//                         {page}
//                     </PaginationLink>
//                 </PaginationItem>
//             ))}

//             <PaginationItem disabled={currentPage === totalPages}>
//                 <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
//             </PaginationItem>

//             <PaginationItem disabled={currentPage === totalPages} className={`${isSmallScreen ? "d-none" : ""}`}>
//                 <PaginationLink last onClick={() => handlePageChange(totalPages)} />
//             </PaginationItem>
//         </Pagination>
//     );
// };

// export default CustomPagination;

import React, { useEffect, useState } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const CustomPagination = ({ totalStocks, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalStocks / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSmallScreen, setIsSmallScreen] = useState(true); // Initialize to false
    const [pageNumbers, setPageNumbers] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined') {
                setIsSmallScreen(window.innerWidth <= 800);
            }
        };

        if (typeof window !== 'undefined') {
            handleResize(); // Check initial window size
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    useEffect(() => {
        setPageNumbers(generatePageNumbers());
    }, [currentPage, isSmallScreen, totalPages]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            onPageChange(page);
        }
    };

    const generatePageNumbers = () => {
        const maxPageItemsToShow = isSmallScreen ? 2 : 5;
        const maxPageItemsWithEllipsis = isSmallScreen ? 1 : 3;
        const pages = [];

        if (totalPages <= maxPageItemsToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - maxPageItemsWithEllipsis);
            let endPage = Math.min(totalPages, currentPage + maxPageItemsWithEllipsis);

            if (currentPage <= maxPageItemsWithEllipsis) {
                endPage = maxPageItemsToShow;
            } else if (currentPage >= totalPages - maxPageItemsWithEllipsis) {
                startPage = totalPages - maxPageItemsToShow + 1;
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (startPage > 1) {
                pages.unshift('...');
                pages.unshift(1);
            }
            if (endPage < totalPages) {
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <Pagination aria-label="Page navigation" size="md">
            <PaginationItem disabled={currentPage === 1} className={`${isSmallScreen ? "d-none" : ""}`}>
                <PaginationLink first onClick={() => handlePageChange(1)} />
            </PaginationItem>

            <PaginationItem disabled={currentPage === 1}>
                <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>

            {pageNumbers.map((page, index) => (
                <PaginationItem key={index} active={currentPage === page}>
                    <PaginationLink onClick={() => page !== '...' && handlePageChange(page)}>
                        {page}
                    </PaginationLink>
                </PaginationItem>
            ))}

            <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>

            <PaginationItem disabled={currentPage === totalPages} className={`${isSmallScreen ? "d-none" : ""}`}>
                <PaginationLink last onClick={() => handlePageChange(totalPages)} />
            </PaginationItem>
        </Pagination>
    );
};

export default CustomPagination;

