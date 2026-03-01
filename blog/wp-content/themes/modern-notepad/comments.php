<?php if ($comments) : ?>
    <h3><?php comments_number('No Responses','One Response','% Responses' );?><a id="comments-<?php the_ID()?>" name="comments"></a></h3>
    <ul class="comments-list"><?php wp_list_comments() ?></ul>
    <?php paginate_comments_links() ?>

<?php else:?>

    <?php if (!comments_open() && !is_page()) : ?>
        <p class="nocomments">Comments are closed.</p>
     <?php endif; ?>

<?php endif; ?>

<?php if (comments_open()) : ?>
    <?php comment_form() ?>
<?php endif; // if you delete this the sky will fall on your head ?>