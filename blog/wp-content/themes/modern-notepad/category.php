<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
<?php
/* template name: Posts by Category! */
get_header(); 
// 2015.01.08 MC added some variables for pagination.
$perpage = 50;
$page = 1;
$curpage = 1;
$count = 1;
?>
<script src='http://code.jquery.com/jquery-1.11.1.min.js'></script>
        <div id="container" style='float:left;width:70%;'> 
            <div id="content" role="main">
 
            <?php
            // get all the categories from the database
                $cats = get_categories(); 
                 
                // loop through the categries
                foreach ($cats as $cat) {
                    // setup the cateogory ID
                    $cat_id= $cat->term_id;
                    if($cat_id != $_GET['cat']) continue;
                    // Make a header for the cateogry
                    echo "<h2>".$cat->name."</h2>";
                    // create a custom wordpress query
                    query_posts("cat=$cat_id&posts_per_page=1000");
                    // start the wordpress loop!
                    if (have_posts()) :
                        echo "<div id='pagination".$curpage."' class='paginationblock'>";
                        while (have_posts()) : the_post(); ?>
<?
    if($count++ % $perpage == 0){
        echo "</div><div id='pagination".++$curpage."' class='paginationblock fade'>";
    }
?>                        
                        <?php // create our link now that the post is setup ?>
                        <a href="<?php the_permalink();?>"><?php the_title(); ?></a>
                        <?php echo '<hr/>'; ?>
 
                    <?php endwhile; 
                    echo "</div>";
                    endif; // done our wordpress loop. Will start again for each category ?>
                <?php } // done the foreach statement ?>
 <?
// pagination block

echo pagingUpt($count, '50','5','1');

function pagingUpt($total_rows, $per_page = '20', $page_limit = '5', $current_page = '1'){
    if($total_rows == '0') return '';
    $total_page = ceil($total_rows/$per_page);
    $page_list = ceil($current_page/$page_limit)-1;
    $navigation = '<div class="col-xs-6 text-center" style="width:100%;">
                        <ul class="pagination pagination-sm" style="margin: 0;">';

//    if ($page_list>0){
    if ($total_page>1){
        $prev_page = ($page_list)*$page_limit; 
        $navigation .= "<li><a href=\"javascript:fn_pagination('1')\"> << </a></li> <li><a href=\"javascript:fn_pagination('p')\"> < Prev </a></li>";
    }

    // display the list on the middle part
    $page_end=($page_list+1)*$page_limit;
    if($page_end>$total_page) $page_end=$total_page;

    if($total_page > 1 ){
        for($setpage=$page_list*$page_limit+1;$setpage<=$page_end;$setpage++){
            if($setpage==$current_page) {
                $navigation .= "<li id='paging_".$setpage."' class='active setpaging'><a href=\"javascript:fn_pagination('$setpage')\"> $setpage</a></li>";
            }else{
                $navigation .= "<li id='paging_".$setpage."' class='setpaging' ><a href=\"javascript:fn_pagination('$setpage')\">$setpage</a> </li>";
            }
        }
    }

//    if ($page_end < $total_page){
    if($total_page > 1 ){    
        $next_page = ($page_list+1)*$page_limit+1;
        $navigation .= "<li><a href=\"javascript:fn_pagination('n')\"> Next > </a> </li><li><a href=\"javascript:fn_pagination('$total_page')\"> >> </a></li> ";
    }
    $navigation .= "</ul></div>";
    return $navigation;
}
?>
<div style="display:none;" id="navbar"></div>
            </div><!-- #content -->
        </div><!-- #container -->
<?php get_sidebar(); ?>
<?php get_footer(); ?>
<style>
.pagination {
    display: inline-block;
    padding-left: 0;
    margin: 20px 0;
}    
.fade{
    display:none;
}
</style>
<script>
var curPage = 1;
var lastPage = <?php echo ceil($count/50); ?> ;
function fn_pagination(val){
    switch(val){
        case "p":
            if(curPage == 1) return false;
            curPage--;
            fn_drawingPagination(curPage);
            $(".pagination li").removeClass('active');
            $("#paging_"+curPage).addClass('active');
            $(".paginationblock").addClass('fade');
            $("#pagination"+curPage).removeClass('fade');
            break;
        case "n":
            if(curPage == lastPage) return false;
            curPage++;
            fn_drawingPagination(curPage);
            $(".pagination li").removeClass('active');
            $("#paging_"+curPage).addClass('active');
            $(".paginationblock").addClass('fade');
            $("#pagination"+curPage).removeClass('fade');
            break;
        default:
            curPage = val;
            fn_drawingPagination(curPage);
            $(".pagination li").removeClass('active');
            $("#paging_"+val).addClass('active');
            $(".paginationblock").addClass('fade');
            $("#pagination"+val).removeClass('fade');        
            break;
    }
}
function fn_drawingPagination(val){
    if(lastPage <= 5) return false;

    if(val <= 3){
        // 1~5
        var i = 1;
        $(".setpaging").each(function(){
            $(this).attr('id','paging_'+i);
            $(this).html("<a href='javascript:fn_pagination(\""+i+"\")'>"+i+"</a>");
            i++;
        });
//        console.log('1' + i + ' ' + val);
    }else if( (lastPage - val) <= 3){
        // last 5
        var i = lastPage - 4;
        $(".setpaging").each(function(){
            $(this).attr('id','paging_'+i);
            $(this).html("<a href='javascript:fn_pagination(\""+i+"\")'>"+i+"</a>");
            i++;
        });
//        console.log('2' + i + ' ' + val);
    }else{
        var i = val - 2;
        $(".setpaging").each(function(){
            $(this).attr('id','paging_'+i);
            $(this).html("<a href='javascript:fn_pagination(\""+i+"\")'>"+i+"</a>");
            i++;
        });
//        console.log('3' + i + ' ' + val);
    }

}
</script>